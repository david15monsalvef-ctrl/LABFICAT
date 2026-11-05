const jwt = require('jsonwebtoken');
const httpError = require('../utils/httpError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user.models');

/**
 * Extrae y valida el token Bearer de la cabecera Authorization.
 * Adjunta req.user con id y role.
 */
const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw httpError(401, 'No autorizado. Token no proporcionado');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw httpError(500, 'JWT_SECRET no está configurada');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw httpError(401, 'Token expirado');
    }
    throw httpError(401, 'Token inválido');
  }

  const user = await User.findById(decoded.id).select('_id name email role isActive');

  if (!user || user.isActive === false) {
    throw httpError(401, 'Usuario no válido o desactivado');
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };

  next();
});

/**
 * Restringe el acceso a los roles indicados.
 * Debe usarse después de protect.
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(httpError(401, 'No autorizado. Autenticación requerida'));
    }

    if (!roles.includes(req.user.role)) {
      return next(httpError(403, 'No tienes permisos para realizar esta acción'));
    }

    return next();
  };
};

module.exports = {
  protect,
  authorize
};
