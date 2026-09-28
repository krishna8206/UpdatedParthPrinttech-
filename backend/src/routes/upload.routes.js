const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, uploadController.uploadMiddleware, uploadController.handleUpload);

module.exports = router;
