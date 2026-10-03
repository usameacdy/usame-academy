const express = require('express');
const db = require('../config/db');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// @desc    Get Global Activity (Superadmin Only)
// @route   GET /api/admin/activity
router.get('/activity', protect, authorize('admin'), async (req, res) => {
    try {
        const activity = await db.query(`
            (SELECT 'enrollment' as type, u.name as user_name, c.title as target, e.enrolled_at as created_at 
             FROM enrollments e 
             JOIN users u ON e.student_id = u.id 
             JOIN courses c ON e.course_id = c.id)
            UNION ALL
            (SELECT 'exam' as type, u.name as user_name, e.title as target, r.taken_at as created_at 
             FROM results r 
             JOIN users u ON r.student_id = u.id 
             JOIN exams e ON r.exam_id = e.id)
            UNION ALL
            (SELECT 'certificate_request' as type, u.name as user_name, c.title as target, cr.created_at 
             FROM certificate_requests cr 
             JOIN users u ON cr.student_id = u.id 
             JOIN courses c ON cr.course_id = c.id)
            UNION ALL
            (SELECT 'assignment_submission' as type, u.name as user_name, a.title as target, s.submitted_at as created_at 
             FROM submissions s 
             JOIN users u ON s.student_id = u.id 
             JOIN assignments a ON s.assignment_id = a.id)
            ORDER BY created_at DESC
            LIMIT 20
        `);
        res.json(activity.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Admin reset user password
// @route   PUT /api/admin/reset-password/:id
router.put('/reset-password/:id', protect, authorize('admin'), async (req, res) => {
    const { newPassword } = req.body;
    const { adminResetPassword } = require('../controllers/authController');
    return adminResetPassword(req, res);
});

module.exports = router;
