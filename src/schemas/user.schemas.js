const { z } = require('zod');

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'El identificador no es válido');

const createUserSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().trim().email('El correo no tiene un formato válido').transform((value) => value.toLowerCase()),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(72, 'La contraseña no puede superar 72 caracteres'),
  role: z.enum(['user', 'admin']).optional().default('user'),
  isActive: z.boolean().optional().default(true)
});

const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().email('El correo no tiene un formato válido').transform((value) => value.toLowerCase()).optional(),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(72, 'La contraseña no puede superar 72 caracteres').optional(),
    role: z.enum(['user', 'admin']).optional(),
    isActive: z.boolean().optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar'
  });

const idParamSchema = z.object({
  id: objectId
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  idParamSchema
};
