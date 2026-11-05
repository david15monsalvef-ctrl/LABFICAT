/**
 * Envuelve controladores async para reenviar errores a errorHandler.
 */
const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
