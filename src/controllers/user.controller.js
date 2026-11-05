const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers({ search: req.query.search });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(201).json({
    success: true,
    message: 'Usuario creado correctamente',
    data: user
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id, req.user);

  res.status(200).json({
    success: true,
    data: user
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body, req.user);

  res.status(200).json({
    success: true,
    message: 'Usuario actualizado correctamente',
    data: user
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: 'Usuario eliminado correctamente'
  });
});

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
