const httpError = require('../utils/httpError');

/**
 * Valida y normaliza una fuente de la petición (body, query o params) con Zod.
 * Reemplaza la fuente validada por los datos saneados.
 */
const validateSchema = (schema, source = 'body') => {
  return (req, _res, next) => {
    const data = req[source] ?? {};
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));

      return next(httpError(422, 'Error de validación', details));
    }

    req[source] = parsed.data;
    return next();
  };
};

module.exports = validateSchema;
