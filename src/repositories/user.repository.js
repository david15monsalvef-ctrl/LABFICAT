const User = require('../models/user.models');
const escapeRegExp = require('../utils/escapeRegExp');

const findAll = ({ search } = {}) => {
  const query = {};

  if (search) {
    const regex = new RegExp(escapeRegExp(search), 'i');
    query.$or = [{ name: regex }, { email: regex }];
  }

  return User.find(query).sort({ createdAt: -1 });
};

const findById = (id) => {
  return User.findById(id);
};

const findByEmail = (email, { includePassword = false } = {}) => {
  const query = User.findOne({ email: String(email).toLowerCase() });
  return includePassword ? query.select('+password') : query;
};

const create = (data) => {
  return User.create(data);
};

const updateById = (id, update) => {
  return User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true
  });
};

const deleteById = (id) => {
  return User.findByIdAndDelete(id);
};

const emailExists = async (email, excludeId) => {
  const query = { email: String(email).toLowerCase() };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Boolean(await User.exists(query));
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  updateById,
  deleteById,
  emailExists
};
