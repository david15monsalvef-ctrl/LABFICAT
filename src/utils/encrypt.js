const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  if (!password) {
    throw new Error('La contraseña es obligatoria');
  }

  return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  if (!candidatePassword || !hashedPassword) {
    return false;
  }

  return bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
