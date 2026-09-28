const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { requireAuth } = require('../middleware/auth');

// Public endpoints
router.get('/header', productController.getProductsHeader);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin protected endpoints
router.put('/header', requireAuth, productController.updateProductsHeader);
router.post('/', requireAuth, productController.createProduct);
router.put('/reorder', requireAuth, productController.reorderProducts);
router.put('/:id', requireAuth, productController.updateProduct);
router.delete('/:id', requireAuth, productController.deleteProduct);

module.exports = router;
