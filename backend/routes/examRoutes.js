const express = require('express');
const {
    getExamByCourse,
    submitExam,
    createExam,
    addQuestion,
    deleteQuestion,
    getExamQuestions,
    getAllResults,
    getMyResults,
    deleteResult
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/course/:courseId', protect, getExamByCourse);
router.post('/:id/submit', protect, submitExam);
router.get('/my-results', protect, getMyResults);
router.get('/results', protect, authorize('admin', 'instructor'), getAllResults);
router.delete('/results/:id', protect, authorize('admin'), deleteResult);

// Management
router.post('/', protect, authorize('admin', 'instructor'), createExam);
router.get('/:id/questions', protect, authorize('admin', 'instructor'), getExamQuestions);
router.post('/:id/questions', protect, authorize('admin', 'instructor'), addQuestion);
router.delete('/questions/:id', protect, authorize('admin', 'instructor'), deleteQuestion);

module.exports = router;
