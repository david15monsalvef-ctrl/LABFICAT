const productRepository = require('../repositories/product.repository');
const httpError = require('../utils/httpError');

const listProducts = async (query = {}, { onlyActive = true } = {}) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    page = 1,
    limit = 20
  } = query;

  return productRepository.findAll(
    { search, category, minPrice, maxPrice, inStock },
    { page, limit, onlyActive }
  );
};

const getProductById = async (id, { allowInactive = false } = {}) => {
  const product = await productRepository.findById(id);

  if (!product || (!allowInactive && product.isActive === false)) {
    throw httpError(404, 'Producto no encontrado');
  }

  return product;
};

const createProduct = async (data) => {
  if (data.stock < 1) {
    // Se permite crear con stock 0, pero es útil avisar en el registro.
    console.warn(`Producto creado sin stock: ${data.name}`);
  }

  return productRepository.create(data);
};

const updateProduct = async (id, data) => {
  const updated = await productRepository.updateById(id, data);

  if (!updated) {
    throw httpError(404, 'Producto no encontrado');
  }

  return updated;
};

/**
 * Baja lógica: conserva el historial de pedidos y evita referencias rotas.
 */
const deleteProduct = async (id) => {
  const updated = await productRepository.updateById(id, { isActive: false });

  if (!updated) {
    throw httpError(404, 'Producto no encontrado');
  }

  return updated;
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
