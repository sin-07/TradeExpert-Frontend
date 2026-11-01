import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      price: { type: Number },
    },
  ],
  total: { type: Number },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

