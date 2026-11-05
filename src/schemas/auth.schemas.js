const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().trim().email('El correo no tiene un formato válido').transform((value) => value.toLowerCase()),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(72, 'La contraseña no puede superar 72 caracteres')
});

const loginSchema = z.object({
  email: z.string().trim().email('El correo no tiene un formato válido').transform((value) => value.toLowerCase()),
  password: z.string().min(1, 'La contraseña es obligatoria')
});

module.exports = {
  registerSchema,
  loginSchema
};
