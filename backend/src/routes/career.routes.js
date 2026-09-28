const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const careerController = require('../controllers/career.controller');
const { requireAuth } = require('../middleware/auth');

// Ensure resume upload directory exists
const resumeUploadDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, { recursive: true });
}

// Multer storage for candidate resumes
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumeUploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `resume-${baseName}-${uniqueSuffix}${ext}`);
  }
});

const resumeFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ];
  if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|doc|docx)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid resume file type. Allowed: PDF, DOC, DOCX'), false);
  }
};

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: resumeFilter
});

// --- Public Endpoints ---
router.get('/', careerController.getCareerData);
router.post('/apply', uploadResume.single('resume'), careerController.submitApplication);

// --- Admin Endpoints (Protected) ---
router.get('/admin', requireAuth, careerController.getCareerAdminData);
router.put('/hero', requireAuth, careerController.updateHero);
router.put('/culture', requireAuth, careerController.updateCulture);
router.put('/process', requireAuth, careerController.updateProcess);
router.put('/contact', requireAuth, careerController.updateContact);

// Job Roles CRUD
router.put('/roles', requireAuth, careerController.updateRoles);
router.post('/roles', requireAuth, careerController.createRole);
router.put('/roles/:id', requireAuth, careerController.updateRole);
router.delete('/roles/:id', requireAuth, careerController.deleteRole);

// Applications ATS Management
router.get('/applications', requireAuth, careerController.getApplications);
router.put('/applications/:id/status', requireAuth, careerController.updateApplicationStatus);
router.delete('/applications/:id', requireAuth, careerController.deleteApplication);

module.exports = router;
