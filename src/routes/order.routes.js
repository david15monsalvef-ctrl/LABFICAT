const express = require('express');
const orderController = require('../controllers/order.controller');
const validateSchema = require('../middlewares/validateSchema.middleware');
const { protect, authorize } = require('../middlewares/auth.middlewares');
const {
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  idParamSchema
} = require('../schemas/order.schemas');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(validateSchema(orderQuerySchema, 'query'), orderController.getOrders)
  .post(validateSchema(createOrderSchema, 'body'), orderController.createOrder);

router
  .route('/:id')
  .get(validateSchema(idParamSchema, 'params'), orderController.getOrderById)
  .delete(authorize('admin'), validateSchema(idParamSchema, 'params'), orderController.deleteOrder);

router.patch(
  '/:id/status',
  authorize('admin'),
  validateSchema(idParamSchema, 'params'),
  validateSchema(updateOrderStatusSchema, 'body'),
  orderController.updateOrderStatus
);

module.exports = router;
