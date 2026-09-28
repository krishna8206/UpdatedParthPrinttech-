const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');
const { requireAuth } = require('../middleware/auth');

// Complete Home data
router.get('/', homeController.getHomeData);

// Hero Slides
router.get('/hero-slides', homeController.getHeroSlides);
router.put('/hero-slides', requireAuth, homeController.updateHeroSlides);

// Hero Background Video
router.get('/hero-video', homeController.getHeroVideo);
router.put('/hero-video', requireAuth, homeController.updateHeroVideo);

// Who We Are
router.get('/who-we-are', homeController.getWhoWeAre);
router.put('/who-we-are', requireAuth, homeController.updateWhoWeAre);

// Markets We Serve
router.get('/markets', homeController.getMarkets);
router.put('/markets', requireAuth, homeController.updateMarkets);

// Featured Products
router.get('/featured-products', homeController.getFeaturedProducts);
router.put('/featured-products', requireAuth, homeController.updateFeaturedProducts);

// Clients
router.get('/clients', homeController.getClients);
router.put('/clients', requireAuth, homeController.updateClients);

// Testimonials
router.get('/testimonials', homeController.getTestimonials);
router.put('/testimonials', requireAuth, homeController.updateTestimonials);

// Values
router.get('/values', homeController.getValues);
router.put('/values', requireAuth, homeController.updateValues);

// Global Settings
router.get('/settings', homeController.getSettings);
router.put('/settings', requireAuth, homeController.updateSettings);

module.exports = router;
