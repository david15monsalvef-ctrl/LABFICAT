const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [150, 'El nombre no puede superar los 150 caracteres']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La descripción no puede superar los 1000 caracteres'],
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
      set: (value) => Math.floor(Number(value))
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
      lowercase: true,
      default: 'general'
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
