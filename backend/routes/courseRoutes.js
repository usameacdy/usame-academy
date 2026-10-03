const express = require('express');
const {
    getCourses,
    getCourseById,
    createCourse,
    addLesson,
    checkEnrollment,
    getEnrolledCourses,
    getLessonContent,
    completeLesson,
    getCourseProgress,
    deleteLesson,
    deleteCourse,
    updateCourse,
    enrollCourse,
    getPendingEnrollments,
    updateEnrollmentStatus
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', getCourses);
router.get('/manage', protect, authorize('admin', 'instructor'), getCourses);
router.get('/enrolled', protect, getEnrolledCourses);
router.get('/:id', getCourseById);
router.get('/:id/enrollment', protect, checkEnrollment);
router.post('/:id/enroll', protect, enrollCourse);
router.get('/admin/pending-enrollments', protect, authorize('admin'), getPendingEnrollments);
router.patch('/admin/enrollments/:id', protect, authorize('admin'), updateEnrollmentStatus);
router.get('/:id/progress', protect, getCourseProgress);
router.get('/lessons/:lessonId', protect, getLessonContent);
router.post('/lessons/:lessonId/complete', protect, completeLesson);

router.post('/', protect, authorize('admin'), upload.single('thumbnail'), createCourse);
router.put('/:id', protect, authorize('admin', 'instructor'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.post('/:id/lessons', protect, authorize('admin', 'instructor'), upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), addLesson);
router.delete('/lessons/:id', protect, authorize('admin'), deleteLesson);

module.exports = router;
