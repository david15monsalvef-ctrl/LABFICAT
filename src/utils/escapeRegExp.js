/**
 * Escapa texto de usuario para usarlo de forma segura dentro de una expresión regular.
 */
const escapeRegExp = (value = '') => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = escapeRegExp;
