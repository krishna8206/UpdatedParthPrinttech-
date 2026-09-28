const express = require('express');
const router = express.Router();
const marketsPageController = require('../controllers/marketsPage.controller');
const { requireAuth } = require('../middleware/auth');

// Public endpoints
router.get('/', marketsPageController.getMarketsPageData);

// Protected update endpoints
router.put('/', requireAuth, marketsPageController.updateMarketsPageData);
router.put('/hero', requireAuth, marketsPageController.updateHero);
router.put('/categories', requireAuth, marketsPageController.updateCategories);
router.put('/industries', requireAuth, marketsPageController.updateIndustries);
router.put('/product-uses', requireAuth, marketsPageController.updateProductUses);
router.put('/featured-solutions', requireAuth, marketsPageController.updateFeaturedSolutions);
router.put('/why-choose-us', requireAuth, marketsPageController.updateWhyChooseUs);
router.put('/process-metrics', requireAuth, marketsPageController.updateProcessMetrics);
router.put('/seo-cta', requireAuth, marketsPageController.updateSeoCta);

module.exports = router;
