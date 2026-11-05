const productService = require('../services/product.service');
const asyncHandler = require('../utils/asyncHandler');

const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query, { onlyActive: true });

  res.status(200).json({
    success: true,
    data: result.items,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

/** Vista de administración: incluye productos desactivados. */
const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query, { onlyActive: false });

  res.status(200).json({
    success: true,
    data: result.items,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    data: product
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    message: 'Producto creado correctamente',
    data: product
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Producto actualizado correctamente',
    data: product
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Producto desactivado correctamente',
    data: product
  });
});

module.exports = {
  getProducts,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
