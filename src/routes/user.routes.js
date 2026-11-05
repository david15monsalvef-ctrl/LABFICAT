const express = require('express');
const userController = require('../controllers/user.controller');
const validateSchema = require('../middlewares/validateSchema.middleware');
const { protect, authorize } = require('../middlewares/auth.middlewares');
const {
  createUserSchema,
  updateUserSchema,
  idParamSchema
} = require('../schemas/user.schemas');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(authorize('admin'), userController.getUsers)
  .post(authorize('admin'), validateSchema(createUserSchema, 'body'), userController.createUser);

router
  .route('/:id')
  .get(validateSchema(idParamSchema, 'params'), userController.getUserById)
  .put(validateSchema(idParamSchema, 'params'), validateSchema(updateUserSchema, 'body'), userController.updateUser)
  .delete(authorize('admin'), validateSchema(idParamSchema, 'params'), userController.deleteUser);

module.exports = router;
