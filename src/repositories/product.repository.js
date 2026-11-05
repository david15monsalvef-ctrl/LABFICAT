const Product = require('../models/product.models');
const escapeRegExp = require('../utils/escapeRegExp');

const buildListQuery = ({ search, category, minPrice, maxPrice, inStock, onlyActive = true } = {}) => {
  const query = {};

  if (onlyActive) {
    query.isActive = true;
  }

  if (search) {
    const regex = new RegExp(escapeRegExp(search), 'i');
    query.$or = [{ name: regex }, { description: regex }, { category: regex }];
  }

  if (category) {
    query.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  if (inStock === 'false') {
    query.stock = 0;
  }

  return query;
};

const findAll = async (filters = {}, { page = 1, limit = 20, onlyActive = true } = {}) => {
  const query = buildListQuery({ ...filters, onlyActive });
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(query)
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit)
  };
};

const findById = (id) => {
  return Product.findById(id);
};

const findByIds = (ids) => {
  return Product.find({ _id: { $in: ids } });
};

const create = (data) => {
  return Product.create(data);
};

const updateById = (id, update) => {
  return Product.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true
  });
};

const deleteById = (id) => {
  return Product.findByIdAndDelete(id);
};

/** Descuenta stock solo si hay unidades suficientes. Devuelve el producto actualizado o null. */
const decrementStock = (id, quantity) => {
  return Product.findOneAndUpdate(
    { _id: id, isActive: true, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true }
  );
};

const incrementStock = (id, quantity) => {
  return Product.findByIdAndUpdate(
    id,
    { $inc: { stock: quantity } },
    { new: true }
  );
};

module.exports = {
  findAll,
  findById,
  findByIds,
  create,
  updateById,
  deleteById,
  decrementStock,
  incrementStock
};
