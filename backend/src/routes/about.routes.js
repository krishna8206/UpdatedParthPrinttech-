const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/about.controller');
const { requireAuth } = require('../middleware/auth');

// Public endpoints
router.get('/', aboutController.getAboutData);

// Protected update endpoints
router.put('/', requireAuth, aboutController.updateAboutData);
router.put('/hero', requireAuth, aboutController.updateAboutHero);
router.put('/who-we-are', requireAuth, aboutController.updateAboutWhoWeAre);
router.put('/founders', requireAuth, aboutController.updateAboutFounders);
router.put('/vision-mission', requireAuth, aboutController.updateAboutVisionMission);
router.put('/history', requireAuth, aboutController.updateAboutHistory);

module.exports = router;
