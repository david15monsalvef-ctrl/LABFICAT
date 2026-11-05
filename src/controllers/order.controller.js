const orderService = require('../services/order.service');
const asyncHandler = require('../utils/asyncHandler');

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder({
    requester: req.user,
    items: req.body.items,
    address: req.body.address
  });

  res.status(201).json({
    success: true,
    message: 'Pedido creado correctamente',
    data: order
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await orderService.listOrders({
    requester: req.user,
    status,
    page,
    limit
  });

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

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user);

  res.status(200).json({
    success: true,
    data: order
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status,
    req.user
  );

  res.status(200).json({
    success: true,
    message: 'Estado del pedido actualizado correctamente',
    data: order
  });
});

const deleteOrder = asyncHandler(async (req, res) => {
  await orderService.deleteOrder(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: 'Pedido eliminado correctamente'
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
