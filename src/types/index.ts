// Core types for the trading app
export interface TradingSignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  confidence: number;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  timestamp: Date;
  reasoning: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: 'FREE' | 'PREMIUM';
  preferences: UserPreferences;
  firstName: string;  // ✅ Fix: Added
  lastName: string;
}

export interface UserPreferences {
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  preferredAssets: string[];
  notificationSettings: {
    signals: boolean;
    news: boolean;
    portfolio: boolean;
  };
}

export interface Portfolio {
  totalValue: number;
  positions: Position[];
  performance: PerformanceMetrics;
  dailyPnL: number;  // ✅ Fix: Added
  dailyPnLPercentage: number;  // ✅ Fix: Added
  totalPnL: number;  // ✅ Fix: Added
  totalPnLPercentage: number;  // ✅ Fix: Added
  activePositions: Position[];  // ✅ Fix: Added
}

export interface Position {
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  timestamp: Date;
}

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  source: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  relevantSymbols: string[];
}
export interface Trade {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  type: 'buy' | 'sell';
  timestamp: string;
  executedAt: string;  // ✅ Fix: Added
}
export interface TradeExecution {
  id: string;
  tradeId: string;
  executedPrice: number;
  executedQuantity: number;
  timestamp: Date;
}

export interface PerformanceChartProps {
  data: any;
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
  height: number;
}