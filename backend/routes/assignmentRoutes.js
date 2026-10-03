const express = require('express');
const { 
    getAssignmentsByCourse, 
    createAssignment, 
    submitAssignment, 
    getSubmissions, 
    gradeSubmission 
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.post('/', protect, authorize('admin', 'instructor'), createAssignment);
router.post('/:id/submit', protect, authorize('student'), upload.single('assignment_file'), submitAssignment);
router.get('/:id/submissions', protect, authorize('admin', 'instructor'), getSubmissions);
router.post('/submissions/:id/grade', protect, authorize('admin', 'instructor'), gradeSubmission);

module.exports = router;
