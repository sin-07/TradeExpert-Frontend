import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  balance: { 
    type: Number, 
    default: 50000,
    min: 0
  },
  positions: [{
    symbol: { type: String, required: true },
    stockName: { type: String, required: true },
    side: { type: String, enum: ['Buy', 'Sell'], required: true },
    quantity: { type: Number, required: true, min: 0 },
    averagePrice: { type: Number, required: true },
    market: { type: String, enum: ['indian', 'us', 'crypto'], required: true },
    lastUpdated: { type: Date, default: Date.now }
  }],
  totalPnL: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

if (!PortfolioSchema.indexes().some(idx => idx[0]?.user === 1)) {
  PortfolioSchema.index({ user: 1 });
}

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

