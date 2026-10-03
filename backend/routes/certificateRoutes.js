const express = require('express');
const { generateCertificate, issueCertificate, getMyCertificates, verifyCertificate, requestCertificate, getCertificateRequests } = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Student: Get my certificates
router.get('/my-certificates', protect, getMyCertificates);

// Public: Verify certificate
router.get('/verify/:code', verifyCertificate);

// Admin/Instructor: Issue a certificate with mother's name and photo
router.post('/issue/:resultId', protect, authorize('admin', 'instructor'), upload.single('profile_picture'), issueCertificate);

// Certificate Requests
router.post('/request/:resultId', protect, authorize('student'), requestCertificate);
router.get('/requests', protect, authorize('admin', 'instructor'), getCertificateRequests);

// Legacy/Fallback (Student clicking)
router.post('/:resultId', protect, generateCertificate);

module.exports = router;
