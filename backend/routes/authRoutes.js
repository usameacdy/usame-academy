const express = require('express');
const { registerUser, loginUser, getUserProfile, getAllUsers, updateUserProfile, deleteUser, createInstructor, lockUser, unlockUser, adminResetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.post('/instructor', protect, authorize('admin'), createInstructor);
router.put('/users/:id/lock', protect, authorize('admin'), lockUser);
router.put('/users/:id/unlock', protect, authorize('admin'), unlockUser);
router.put('/reset-admin/:id', protect, authorize('admin'), adminResetPassword);

module.exports = router;
