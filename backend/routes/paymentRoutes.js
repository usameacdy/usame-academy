const express = require('express');
const { createStripeIntent, processLocalPayment, getRevenueAnalytics, deleteTransaction, submitRentPayment, getRentalRequests, approveRentPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/stripe/create-intent', protect, createStripeIntent);
router.post('/local/mock', protect, processLocalPayment);
router.get('/revenue', protect, authorize('admin', 'instructor'), getRevenueAnalytics);
router.delete('/transactions/:id', protect, authorize('admin'), deleteTransaction);
router.post('/rent/submit', protect, authorize('instructor'), submitRentPayment);
router.get('/rent/requests', protect, authorize('admin'), getRentalRequests);
router.put('/rent/approve/:id', protect, authorize('admin'), approveRentPayment);

module.exports = router;
