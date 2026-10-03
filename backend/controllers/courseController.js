const db = require('../config/db');

// @desc    Get all courses
// @route   GET /api/courses
exports.getCourses = async (req, res) => {
    try {
        let queryStr = 'SELECT c.*, u.name as instructor_name FROM courses c LEFT JOIN users u ON c.instructor_id = u.id';
        let params = [];
        
        if (req.user && req.user.role === 'instructor') {
            queryStr += ' WHERE c.instructor_id = $1';
            params.push(req.user.id);
        }
        
        queryStr += ' ORDER BY c.created_at DESC';

        const result = await db.query(queryStr, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if enrolled
// @route   GET /api/courses/:id/enrollment
exports.checkEnrollment = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2',
            [req.user.id, req.params.id]
        );
        if (result.rows.length === 0) return res.json({ enrolled: false });
        res.json({ 
            enrolled: true, 
            status: result.rows[0].status 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get enrolled courses for student
// @route   GET /api/courses/enrolled
exports.getEnrolledCourses = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT c.*, u.name as instructor_name, e.status as enrollment_status FROM courses c LEFT JOIN users u ON c.instructor_id = u.id JOIN enrollments e ON c.id = e.course_id WHERE e.student_id = $1 AND e.status = $2',
            [req.user.id, 'active']
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get lesson content (only for enrolled)
// @route   GET /api/courses/lessons/:lessonId
exports.getLessonContent = async (req, res) => {
    try {
        const lesson = await db.query('SELECT * FROM lessons WHERE id = $1', [req.params.lessonId]);
        if (lesson.rows.length === 0) return res.status(404).json({ message: 'Lesson not found' });

        const course_id = lesson.rows[0].course_id;
        const enrollment = await db.query('SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2', [req.user.id, course_id]);

        if ((req.user.role !== 'admin') && (enrollment.rows.length === 0 || enrollment.rows[0].status !== 'active')) {
            const message = enrollment.rows.length === 0 ? 'Koorso ma aadan iibsan' : 'Lacag bixintaada ayaa la hubinayaa... fadlan sug ilaa lagaa aqbalo.';
            return res.status(403).json({ message });
        }

        res.json(lesson.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark lesson as completed
// @route   POST /api/courses/lessons/:lessonId/complete
exports.completeLesson = async (req, res) => {
    try {
        const lesson = await db.query('SELECT * FROM lessons WHERE id = $1', [req.params.lessonId]);
        if (lesson.rows.length === 0) return res.status(404).json({ message: 'Lesson not found' });

        await db.query(
            'INSERT INTO progress (student_id, lesson_id, is_completed) VALUES ($1, $2, true) ON CONFLICT (student_id, lesson_id) DO UPDATE SET is_completed = true',
            [req.user.id, req.params.lessonId]
        );

        res.json({ message: 'Lesson completed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get course progress
// @route   GET /api/courses/:id/progress
exports.getCourseProgress = async (req, res) => {
    try {
        const totalLessons = await db.query('SELECT COUNT(*) FROM lessons WHERE course_id = $1', [req.params.id]);
        const completedLessons = await db.query(
            'SELECT COUNT(*) FROM progress p JOIN lessons l ON p.lesson_id = l.id WHERE l.course_id = $1 AND p.student_id = $2 AND p.is_completed = true',
            [req.params.id, req.user.id]
        );

        const total = parseInt(totalLessons.rows[0].count);
        const completed = parseInt(completedLessons.rows[0].count);
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        res.json({ total, completed, percentage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
exports.getCourseById = async (req, res) => {
    try {
        const courseResult = await db.query(
            'SELECT c.*, u.name as instructor_name FROM courses c LEFT JOIN users u ON c.instructor_id = u.id WHERE c.id = $1',
            [req.params.id]
        );

        if (courseResult.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lessonsResult = await db.query(
            'SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index ASC',
            [req.params.id]
        );

        res.json({
            ...courseResult.rows[0],
            lessons: lessonsResult.rows,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create course
// @route   POST /api/courses
exports.createCourse = async (req, res) => {
    const { title, description, price, category } = req.body;
    const thumbnail_url = req.file ? `/uploads/courses/${req.file.filename}` : null;
    try {
        const result = await db.query(
            'INSERT INTO courses (title, description, price, instructor_id, thumbnail_url, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, price, req.user.id, thumbnail_url, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
exports.addLesson = async (req, res) => {
    const { title, content, video_url, pdf_url, order_index } = req.body;
    const course_id = req.params.id;

    try {
        // Ownership check
        if (req.user.role === 'instructor') {
            const courseCheck = await db.query('SELECT * FROM courses WHERE id = $1 AND instructor_id = $2', [course_id, req.user.id]);
            if (courseCheck.rows.length === 0) {
                return res.status(403).json({ message: 'Unauthorized: You do not own this course' });
            }
        }

        let finalVideoUrl = video_url;
        let finalPdfUrl = pdf_url;
        let finalImageUrl = null;

        if (req.files) {
            if (req.files.video) finalVideoUrl = `/uploads/videos/${req.files.video[0].filename}`;
            if (req.files.pdf) finalPdfUrl = `/uploads/resources/${req.files.pdf[0].filename}`;
            if (req.files.image) finalImageUrl = `/uploads/lesson_images/${req.files.image[0].filename}`;
        }

        const result = await db.query(
            'INSERT INTO lessons (course_id, title, content, video_url, pdf_url, image_url, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [course_id, title, content, finalVideoUrl, finalPdfUrl, finalImageUrl, order_index]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enroll in course (free for now)
// @route   POST /api/courses/:id/enroll
exports.enrollCourse = async (req, res) => {
    try {
        await db.query(
            'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.user.id, req.params.id]
        );
        res.json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete lesson
// @route   DELETE /api/courses/lessons/:id
exports.deleteLesson = async (req, res) => {
    try {
        await db.query('DELETE FROM lessons WHERE id = $1', [req.params.id]);
        res.json({ message: 'Lesson deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
    try {
        let queryStr = 'DELETE FROM courses WHERE id = $1';
        let params = [req.params.id];

        if (req.user && req.user.role === 'instructor') {
            queryStr += ' AND instructor_id = $2';
            params.push(req.user.id);
        }

        queryStr += ' RETURNING *';

        const result = await db.query(queryStr, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found or unauthorized' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
exports.updateCourse = async (req, res) => {
    const { title, description, price, category } = req.body;
    try {
        let queryStr = 'UPDATE courses SET title = $1, description = $2, price = $3, category = $4 WHERE id = $5';
        let params = [title, description, price, category, req.params.id];

        if (req.user && req.user.role === 'instructor') {
            queryStr += ' AND instructor_id = $6';
            params.push(req.user.id);
        }

        queryStr += ' RETURNING *';

        const result = await db.query(queryStr, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found or unauthorized' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get pending enrollments for admin
// @route   GET /api/courses/admin/pending-enrollments
exports.getPendingEnrollments = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT e.id, e.status, e.enrolled_at, u.name as student_name, u.email as student_email, c.title as course_title, c.price FROM enrollments e JOIN users u ON e.student_id = u.id JOIN courses c ON e.course_id = c.id WHERE e.status = $1 ORDER BY e.enrolled_at DESC',
            ['pending']
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update enrollment status (approve/block)
// @route   PATCH /api/courses/admin/enrollments/:id
exports.updateEnrollmentStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const result = await db.query(
            'UPDATE enrollments SET status = $1 WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
