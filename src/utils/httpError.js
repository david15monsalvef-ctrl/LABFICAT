/**
 * Crea un Error de aplicación con código HTTP y detalles opcionales.
 * Usa esta utilidad para producir respuestas de error controladas.
 */
const httpError = (statusCode, message, details) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  error.isOperational = true;
  return error;
};

module.exports = httpError;
