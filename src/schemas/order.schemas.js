const { z } = require('zod');

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'El identificador no es válido');

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: objectId,
        quantity: z.number().int('La cantidad debe ser un número entero').min(1, 'La cantidad mínima es 1').max(100, 'La cantidad máxima es 100')
      })
    )
    .min(1, 'El pedido debe contener al menos un producto')
    .max(100, 'El pedido no puede contener más de 100 productos'),
  address: z.string().trim().min(5, 'La dirección debe tener al menos 5 caracteres').max(300, 'La dirección no puede superar los 300 caracteres')
});

const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES, {
    error: 'El estado del pedido no es válido'
  })
});

const orderQuerySchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
});

const idParamSchema = z.object({
  id: objectId
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  idParamSchema,
  ORDER_STATUSES
};
