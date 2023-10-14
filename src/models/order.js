const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  products: [orderItemSchema],

  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "process"
  }
});

const Order_model = mongoose.model('order', orderSchema);

module.exports = Order_model;
