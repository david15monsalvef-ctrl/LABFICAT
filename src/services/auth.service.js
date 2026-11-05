const userRepository = require('../repositories/user.repository');
const httpError = require('../utils/httpError');
const { hashPassword, comparePassword } = require('../utils/encrypt');
const generateToken = require('../utils/generate');

const register = async ({ name, email, password }) => {
  const exists = await userRepository.emailExists(email);

  if (exists) {
    throw httpError(409, 'Ya existe un usuario con ese correo');
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role: 'user'
  });

  return {
    user,
    token: generateToken(user)
  };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email, { includePassword: true });

  if (!user || user.isActive === false) {
    throw httpError(401, 'Credenciales inválidas');
  }

  const passwordsMatch = await comparePassword(password, user.password);

  if (!passwordsMatch) {
    throw httpError(401, 'Credenciales inválidas');
  }

  return {
    user: user.toJSON(),
    token: generateToken(user)
  };
};

const getMe = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw httpError(404, 'Usuario no encontrado');
  }

  return user;
};

module.exports = {
  register,
  login,
  getMe
};
