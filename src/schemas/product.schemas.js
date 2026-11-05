const { z } = require('zod');

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'El identificador no es válido');

const createProductSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(150),
  description: z.string().trim().max(1000, 'La descripción no puede superar los 1000 caracteres').optional().default(''),
  price: z.number({ required_error: 'El precio es obligatorio' }).finite('El precio debe ser un número válido').min(0, 'El precio no puede ser negativo'),
  stock: z.number({ required_error: 'El stock es obligatorio' }).int('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo'),
  category: z.string().trim().min(1, 'La categoría es obligatoria').max(100).transform((value) => value.toLowerCase()).optional().default('general'),
  imageUrl: z.union([z.literal(''), z.url('La imagen debe ser una URL válida')]).optional().default(''),
  isActive: z.boolean().optional().default(true)
});

const updateProductSchema = z
  .object({
    name: z.string().trim().min(2).max(150).optional(),
    description: z.string().trim().max(1000).optional(),
    price: z.number().finite('El precio debe ser un número válido').min(0, 'El precio no puede ser negativo').optional(),
    stock: z.number().int('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo').optional(),
    category: z.string().trim().min(1).max(100).transform((value) => value.toLowerCase()).optional(),
    imageUrl: z.union([z.literal(''), z.url('La imagen debe ser una URL válida')]).optional(),
    isActive: z.boolean().optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar'
  });

const productQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).transform((value) => value.toLowerCase()).optional(),
  minPrice: z.coerce.number().finite().min(0).optional(),
  maxPrice: z.coerce.number().finite().min(0).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  inStock: z.enum(['true', 'false']).optional()
});

const idParamSchema = z.object({
  id: objectId
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  idParamSchema
};
