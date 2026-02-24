const express = require('express');
const inquiryController = require('../controllers/inquiryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public route - anyone can submit an inquiry
router.post('/', inquiryController.createInquiry);

// Public route - anyone can track inquiry by reference code
router.get('/track/:referenceCode', inquiryController.trackInquiry);

// Protected routes - only authenticated admins can access
// Apply authentication middleware to all routes below
router.use('/admin', authMiddleware.protect);

// Admin routes for managing inquiries
router.get('/admin', inquiryController.getInquiries);
router.get('/admin/:id', inquiryController.getInquiry);
router.put('/admin/:id', inquiryController.updateInquiry);
router.post('/admin/:id/followups', inquiryController.addFollowUp);

module.exports = router;