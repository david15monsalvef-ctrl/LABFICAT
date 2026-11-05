const express = require('express');
const productController = require('../controllers/product.controller');
const validateSchema = require('../middlewares/validateSchema.middleware');
const { protect, authorize } = require('../middlewares/auth.middlewares');
const {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  idParamSchema
} = require('../schemas/product.schemas');

const router = express.Router();

router.get(
  '/',
  validateSchema(productQuerySchema, 'query'),
  productController.getProducts
);

router.get(
  '/all',
  protect,
  authorize('admin'),
  validateSchema(productQuerySchema, 'query'),
  productController.getAllProducts
);

router.get(
  '/:id',
  validateSchema(idParamSchema, 'params'),
  productController.getProductById
);

router.post(
  '/',
  protect,
  authorize('admin'),
  validateSchema(createProductSchema, 'body'),
  productController.createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateSchema(idParamSchema, 'params'),
  validateSchema(updateProductSchema, 'body'),
  productController.updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  validateSchema(idParamSchema, 'params'),
  productController.deleteProduct
);

module.exports = router;
