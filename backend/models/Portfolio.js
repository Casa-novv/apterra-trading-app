const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: String,
  amount: Number,
  entryPrice: Number,
  currentPrice: Number,
  pnl: Number,
  pnlPercent: Number,
  openedAt: Date,
  status: String
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);