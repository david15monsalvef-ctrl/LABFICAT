const Order = require('../models/order.models');

const populateOrder = (query) => {
  return query
    .populate('user', 'name email role')
    .populate('items.product', 'name price category imageUrl');
};

const findAll = async ({ user, status } = {}, { page = 1, limit = 20 } = {}) => {
  const filter = {};

  if (user) {
    filter.user = user;
  }

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    populateOrder(
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ),
    Order.countDocuments(filter)
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
  return populateOrder(Order.findById(id));
};

const findDocumentById = (id) => {
  return Order.findById(id);
};

const create = (data) => {
  return Order.create(data);
};

const save = (orderDocument) => {
  return orderDocument.save();
};

const deleteById = (id) => {
  return Order.findByIdAndDelete(id);
};

module.exports = {
  findAll,
  findById,
  findDocumentById,
  create,
  save,
  deleteById
};
