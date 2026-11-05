const mongoose = require('mongoose');

/**
 * Middleware final de errores.
 * Devuelve respuestas JSON consistentes y evita filtrar trazas en producción.
 */
const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || 'Error interno del servidor';
  let details = error.details;

  // JSON inválido en el body (express.json).
  if (error.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'El cuerpo de la petición no contiene un JSON válido';
  }

  // Cuerpo demasiado grande.
  if (error.type === 'entity.too.large') {
    statusCode = 413;
    message = 'El cuerpo de la petición es demasiado grande';
  }

  // Identificador u otro tipo de casteo inválido en Mongoose.
  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Valor inválido para el campo ${error.path}`;
  }

  // Validación de Mongoose.
  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = 'Error de validación';
    details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message
    }));
  }

  // Clave duplicada (p. ej. email único).
  if (error.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(error.keyValue || {});
    message = fields.length
      ? `Ya existe un registro con el mismo ${fields.join(', ')}`
      : 'Ya existe un registro con esos datos';
    details = error.keyValue ? [{ fields: error.keyValue }] : undefined;
  }

  // JWT
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  const response = {
    success: false,
    message
  };

  if (details) {
    response.details = details;
  }

  if (process.env.NODE_ENV !== 'production' && statusCode >= 500) {
    response.stack = error.stack;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
