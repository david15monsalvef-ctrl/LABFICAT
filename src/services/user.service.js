const userRepository = require('../repositories/user.repository');
const httpError = require('../utils/httpError');
const { hashPassword } = require('../utils/encrypt');

const listUsers = async ({ search } = {}) => {
  return userRepository.findAll({ search });
};

const createUser = async ({ name, email, password, role = 'user', isActive = true }) => {
  const exists = await userRepository.emailExists(email);

  if (exists) {
    throw httpError(409, 'Ya existe un usuario con ese correo');
  }

  const hashedPassword = await hashPassword(password);

  return userRepository.create({
    name,
    email,
    password: hashedPassword,
    role,
    isActive
  });
};

const getUserById = async (id, requester) => {
  const isAdmin = requester?.role === 'admin';
  const isSelf = requester?.id === id;

  if (!isAdmin && !isSelf) {
    throw httpError(403, 'No tienes permisos para ver este usuario');
  }

  const user = await userRepository.findById(id);

  if (!user) {
    throw httpError(404, 'Usuario no encontrado');
  }

  return user;
};

const updateUser = async (id, data, requester) => {
  const isAdmin = requester?.role === 'admin';
  const isSelf = requester?.id === id;

  if (!isAdmin && !isSelf) {
    throw httpError(403, 'No tienes permisos para actualizar este usuario');
  }

  if (!isAdmin && ('role' in data || 'isActive' in data)) {
    throw httpError(403, 'Solo un administrador puede modificar el rol o el estado del usuario');
  }

  const user = await userRepository.findById(id);

  if (!user) {
    throw httpError(404, 'Usuario no encontrado');
  }

  if (data.email && data.email !== user.email) {
    const exists = await userRepository.emailExists(data.email, id);
    if (exists) {
      throw httpError(409, 'Ya existe otro usuario con ese correo');
    }
  }

  const update = { ...data };

  if (data.password) {
    update.password = await hashPassword(data.password);
  }

  const updated = await userRepository.updateById(id, update);

  if (!updated) {
    throw httpError(404, 'Usuario no encontrado');
  }

  return updated;
};

const deleteUser = async (id, requester) => {
  if (requester?.role !== 'admin') {
    throw httpError(403, 'Solo un administrador puede eliminar usuarios');
  }

  if (requester?.id === id) {
    throw httpError(400, 'No puedes eliminar tu propia cuenta');
  }

  const deleted = await userRepository.deleteById(id);

  if (!deleted) {
    throw httpError(404, 'Usuario no encontrado');
  }

  return deleted;
};

module.exports = {
  listUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
