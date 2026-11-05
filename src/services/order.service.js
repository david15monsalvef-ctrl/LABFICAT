const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const httpError = require('../utils/httpError');

const getRequesterId = (requester) => requester?.id || requester;
const isAdmin = (requester) => requester?.role === 'admin';

const assertCanAccessOrder = (order, requester) => {
  if (isAdmin(requester)) {
    return;
  }

  const ownerId = order.user?._id?.toString() || order.user?.toString();

  if (ownerId !== getRequesterId(requester)) {
    throw httpError(403, 'No tienes permisos para acceder a este pedido');
  }
};

const aggregateItems = (items) => {
  const quantities = new Map();

  for (const item of items) {
    const current = quantities.get(item.product) || 0;
    quantities.set(item.product, current + item.quantity);
  }

  return quantities;
};

const restoreStock = async (items) => {
  for (const item of items) {
    const productId = item.product?._id || item.product;
    if (productId) {
      await productRepository.incrementStock(productId, item.quantity);
    }
  }
};

const restoreReservedStock = async (reservations) => {
  for (const reservation of reservations) {
    await productRepository.incrementStock(reservation.product, reservation.quantity);
  }
};

const createOrder = async ({ requester, items, address }) => {
  const userId = getRequesterId(requester);
  const quantities = aggregateItems(items);
  const productIds = [...quantities.keys()];
  const products = await productRepository.findByIds(productIds);
  const productsById = new Map(products.map((product) => [product._id.toString(), product]));

  // Validaciones previas antes de tocar el stock.
  for (const [productId, quantity] of quantities) {
    const product = productsById.get(productId);

    if (!product || product.isActive === false) {
      throw httpError(404, `Producto no disponible: ${productId}`);
    }

    if (product.stock < quantity) {
      throw httpError(409, `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`);
    }
  }

  // Reserva de stock atómica por producto; revierte lo reservado si falla.
  const reservations = [];

  for (const [productId, quantity] of quantities) {
    const reserved = await productRepository.decrementStock(productId, quantity);

    if (!reserved) {
      await restoreReservedStock(reservations);
      throw httpError(409, 'No hay stock suficiente para completar el pedido');
    }

    reservations.push({ product: productId, quantity });
  }

  const orderItems = [...quantities.entries()].map(([productId, quantity]) => {
    const product = productsById.get(productId);
    return {
      product: productId,
      quantity,
      price: product.price
    };
  });

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  try {
    const order = await orderRepository.create({
      user: userId,
      items: orderItems,
      total,
      address,
      status: 'pending'
    });

    return orderRepository.findById(order._id);
  } catch (error) {
    await restoreReservedStock(reservations);
    throw error;
  }
};

const listOrders = async ({ requester, status, page = 1, limit = 20 }) => {
  const filter = { status };

  if (!isAdmin(requester)) {
    filter.user = getRequesterId(requester);
  }

  return orderRepository.findAll(filter, { page, limit });
};

const getOrderById = async (id, requester) => {
  const order = await orderRepository.findById(id);

  if (!order) {
    throw httpError(404, 'Pedido no encontrado');
  }

  assertCanAccessOrder(order, requester);

  return order;
};

const FINAL_STATUSES = ['delivered', 'cancelled'];

const updateOrderStatus = async (id, status, requester) => {
  if (!isAdmin(requester)) {
    throw httpError(403, 'Solo un administrador puede cambiar el estado del pedido');
  }

  const order = await orderRepository.findDocumentById(id);

  if (!order) {
    throw httpError(404, 'Pedido no encontrado');
  }

  if (FINAL_STATUSES.includes(order.status)) {
    throw httpError(400, `No se puede modificar un pedido en estado "${order.status}"`);
  }

  const wasCancelled = status === 'cancelled' && order.status !== 'cancelled';

  if (wasCancelled) {
    await restoreStock(order.items);
  }

  order.status = status;
  await orderRepository.save(order);

  return orderRepository.findById(order._id);
};

const deleteOrder = async (id, requester) => {
  if (!isAdmin(requester)) {
    throw httpError(403, 'Solo un administrador puede eliminar pedidos');
  }

  const order = await orderRepository.findDocumentById(id);

  if (!order) {
    throw httpError(404, 'Pedido no encontrado');
  }

  // Si el pedido aún no fue entregado ni cancelado, devuelve el stock.
  if (!['delivered', 'cancelled'].includes(order.status)) {
    await restoreStock(order.items);
  }

  await orderRepository.deleteById(id);

  return { id };
};

module.exports = {
  createOrder,
  listOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
