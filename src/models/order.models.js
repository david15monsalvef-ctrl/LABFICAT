const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producto es obligatorio']
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad mínima es 1'],
      set: (value) => Math.floor(Number(value))
    },
    price: {
      type: Number,
      required: [true, 'El precio del producto es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    }
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario del pedido es obligatorio'],
      index: true
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'El pedido debe contener al menos un producto'
      },
      required: true
    },
    total: {
      type: Number,
      required: [true, 'El total es obligatorio'],
      min: [0, 'El total no puede ser negativo']
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true
    },
    address: {
      type: String,
      required: [true, 'La dirección de entrega es obligatoria'],
      trim: true,
      maxlength: [300, 'La dirección no puede superar los 300 caracteres']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
