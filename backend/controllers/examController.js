const db = require('../config/db');

// @desc    Get exam for a course
// @route   GET /api/exams/course/:courseId
exports.getExamByCourse = async (req, res) => {
    try {
        const exam = await db.query('SELECT * FROM exams WHERE course_id = $1', [req.params.courseId]);
        if (exam.rows.length === 0) return res.status(404).json({ message: 'No exam found for this course' });

        const questions = await db.query('SELECT id, question_text, options, question_type FROM questions WHERE exam_id = $1', [exam.rows[0].id]);

        res.json({ ...exam.rows[0], questions: questions.rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit exam results
// @route   POST /api/exams/:id/submit
exports.submitExam = async (req, res) => {
    const { answers } = req.body; // { question_id: 'A', ... }
    const exam_id = req.params.id;

    try {
        const questions = await db.query('SELECT * FROM questions WHERE exam_id = $1', [exam_id]);
        const exam = await db.query('SELECT * FROM exams WHERE id = $1', [exam_id]);

        let correctCount = 0;
        questions.rows.forEach(q => {
            const userAnswer = answers[q.id];
            const correctAnswer = q.correct_option;

            if (q.question_type === 'short_answer') {
                if (userAnswer && correctAnswer && String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()) {
                    correctCount++;
                }
            } else {
                if (userAnswer && correctAnswer && String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()) {
                    correctCount++;
                }
            }
        });

        const score = questions.rows.length > 0 ? Math.round((correctCount / questions.rows.length) * 100) : 0;
        const passed = score >= 55; // Updated passing score to 55% as per user request

        const result = await db.query(
            'INSERT INTO results (exam_id, student_id, score, passed) VALUES ($1, $2, $3, $4) RETURNING *',
            [exam_id, req.user.id, score, passed]
        );

        res.json({ score, passed, result_id: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create/Update Exam
// @route   POST /api/exams
exports.createExam = async (req, res) => {
    const { course_id, title, duration_minutes, passing_score } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO exams (course_id, title, duration_minutes, passing_score) VALUES ($1, $2, $3, $4) ON CONFLICT (course_id) DO UPDATE SET title = $2, duration_minutes = $3, passing_score = $4 RETURNING *',
            [course_id, title, duration_minutes || 30, passing_score || 70]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add Question to Exam
// @route   POST /api/exams/:id/questions
exports.addQuestion = async (req, res) => {
    const { question_text, options, correct_option, question_type } = req.body;
    const exam_id = req.params.id;
    try {
        // pg handles JSONB serialization automatically - no need to JSON.stringify
        const optionsValue = typeof options === 'string' ? options : JSON.stringify(options);
        const result = await db.query(
            'INSERT INTO questions (exam_id, question_text, options, correct_option, question_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [exam_id, question_text, optionsValue, correct_option, question_type || 'multiple_choice']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Question
// @route   DELETE /api/exams/questions/:id
exports.deleteQuestion = async (req, res) => {
    try {
        await db.query('DELETE FROM questions WHERE id = $1', [req.params.id]);
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get questions for an exam
// @route   GET /api/exams/:id/questions
exports.getExamQuestions = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM questions WHERE exam_id = $1', [req.params.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all exam results (Admin or Instructor)
// @route   GET /api/exams/results
exports.getAllResults = async (req, res) => {
    try {
        let queryStr = `
            SELECT r.*, u.name as student_name, e.title as exam_title, e.course_id, c.instructor_id
            FROM results r
            JOIN users u ON r.student_id = u.id
            JOIN exams e ON r.exam_id = e.id
            JOIN courses c ON e.course_id = c.id
        `;
        let params = [];

        if (req.user && req.user.role === 'instructor') {
            queryStr += ` WHERE c.instructor_id = $1`;
            params.push(req.user.id);
        }

        queryStr += ` ORDER BY r.taken_at DESC`;

        const result = await db.query(queryStr, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my exam results (Student)
// @route   GET /api/exams/my-results
exports.getMyResults = async (req, res) => {
    try {
        const query = `
            SELECT r.*, e.title as exam_title, e.course_id
            FROM results r
            JOIN exams e ON r.exam_id = e.id
            WHERE r.student_id = $1
            ORDER BY r.taken_at DESC
        `;
        const result = await db.query(query, [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteResult = async (req, res) => {
    try {
        await db.query('DELETE FROM results WHERE id = $1', [req.params.id]);
        res.json({ message: 'Natiijada waa la tirtiray' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
