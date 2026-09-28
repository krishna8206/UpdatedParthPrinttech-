const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { requireAuth } = require('../middleware/auth');

// Public Routes
router.get('/', contactController.getContactData);
router.post('/submit', contactController.submitInquiry);

// Admin Routes (Protected)
router.get('/admin', requireAuth, contactController.getContactAdminData);
router.put('/content', requireAuth, contactController.updateContactContent);
router.put('/inquiries/:id/status', requireAuth, contactController.updateInquiryStatus);
router.delete('/inquiries/:id', requireAuth, contactController.deleteInquiry);

module.exports = router;
