const db = require('../config/db');

// @desc    Get assignments for a course
// @route   GET /api/assignments/course/:courseId
exports.getAssignmentsByCourse = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM assignments WHERE course_id = $1 ORDER BY created_at DESC', [req.params.courseId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Assignment (Instructor/Admin)
// @route   POST /api/assignments
exports.createAssignment = async (req, res) => {
    const { course_id, title, description, due_date } = req.body;
    try {
        // Ownership check
        if (req.user.role === 'instructor') {
            const courseCheck = await db.query('SELECT * FROM courses WHERE id = $1 AND instructor_id = $2', [course_id, req.user.id]);
            if (courseCheck.rows.length === 0) {
                return res.status(403).json({ message: 'Unauthorized: You do not own this course' });
            }
        }

        const result = await db.query(
            'INSERT INTO assignments (course_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [course_id, title, description, due_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit Assignment (Student)
// @route   POST /api/assignments/:id/submit
exports.submitAssignment = async (req, res) => {
    const { submission_text } = req.body;
    const assignment_id = req.params.id;
    const file_url = req.file ? `/uploads/submissions/${req.file.filename}` : null;

    try {
        // Check if assignment exists
        const assignment = await db.query('SELECT * FROM assignments WHERE id = $1', [assignment_id]);
        if (assignment.rows.length === 0) return res.status(404).json({ message: 'Assignment not found' });

        const result = await db.query(
            'INSERT INTO submissions (assignment_id, student_id, submission_text, file_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [assignment_id, req.user.id, submission_text, file_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Submissions for Assignment (Instructor/Admin)
// @route   GET /api/assignments/:id/submissions
exports.getSubmissions = async (req, res) => {
    try {
        const assignment = await db.query(`
            SELECT a.*, c.instructor_id 
            FROM assignments a 
            JOIN courses c ON a.course_id = c.id 
            WHERE a.id = $1
        `, [req.params.id]);

        if (assignment.rows.length === 0) return res.status(404).json({ message: 'Assignment not found' });

        if (req.user.role === 'instructor' && assignment.rows[0].instructor_id !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const submissions = await db.query(`
            SELECT s.*, u.name as student_name, u.email as student_email
            FROM submissions s
            JOIN users u ON s.student_id = u.id
            WHERE s.assignment_id = $1
            ORDER BY s.submitted_at DESC
        `, [req.params.id]);

        res.json(submissions.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Grade Submission (Instructor/Admin)
// @route   POST /api/assignments/submissions/:id/grade
exports.gradeSubmission = async (req, res) => {
    const { grade, feedback } = req.body;
    try {
        const submission = await db.query(`
            SELECT s.*, a.course_id, c.instructor_id
            FROM submissions s
            JOIN assignments a ON s.assignment_id = a.id
            JOIN courses c ON a.course_id = c.id
            WHERE s.id = $1
        `, [req.params.id]);

        if (submission.rows.length === 0) return res.status(404).json({ message: 'Submission not found' });

        if (req.user.role === 'instructor' && submission.rows[0].instructor_id !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await db.query(
            'UPDATE submissions SET grade = $1, feedback = $2 WHERE id = $3 RETURNING *',
            [grade, feedback, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
