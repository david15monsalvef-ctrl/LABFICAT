/**
 * Formatea una fecha como YYYY-MM-DD.
 * Devuelve null si la fecha recibida no es válida.
 */
const formateDate = (dateInput = new Date()) => {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

module.exports = formateDate;
