const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Example route
app.get('/', (req, res) => res.send('API Running'));

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const server = http.createServer(app);

// --- WebSocket setup ---
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');
  ws.send(JSON.stringify({ type: 'welcome', message: 'WebSocket connection established!' }));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// --- Fetch and broadcast prices ---
const ALPHA_VANTAGE_KEY = 'NRMUQROS2MY4YZWW';
const TWELVE_DATA_KEY = 'b4ed97e86b20441d8c0cfc80347bbcb5';

async function fetchFromCoinGecko() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd';
  const response = await fetch(url);
  const data = await response.json();
  if (!data.bitcoin || !data.ethereum || !data.solana) throw new Error('CoinGecko rate limit or bad data');
  return {
    BTC: data.bitcoin.usd,
    ETH: data.ethereum.usd,
    SOL: data.solana.usd,
  };
}

async function fetchFromBinance() {
  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
  const prices = {};
  for (const symbol of symbols) {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    const data = await response.json();
    if (!data.price) throw new Error('Binance rate limit or bad data');
    prices[symbol.replace('USDT', '')] = parseFloat(data.price);
  }
  return {
    BTC: prices.BTC,
    ETH: prices.ETH,
    SOL: prices.SOL,
  };
}

async function fetchFromAlphaVantage() {
  // Alpha Vantage is very rate-limited (5/min), so use as backup
  const symbols = { BTC: 'BTCUSD', ETH: 'ETHUSD', SOL: 'SOLUSD' };
  const prices = {};
  for (const [key, symbol] of Object.entries(symbols)) {
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${key}&to_currency=USD&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const rate = data['Realtime Currency Exchange Rate']?.['5. Exchange Rate'];
    if (!rate) throw new Error('Alpha Vantage rate limit or bad data');
    prices[key] = parseFloat(rate);
  }
  return prices;
}

async function fetchFromTwelveData() {
  // Twelve Data: 8 requests/minute on free plan
  const url = `https://api.twelvedata.com/price?symbol=BTC/USD,ETH/USD,SOL/USD&apikey=${TWELVE_DATA_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data['BTC/USD'] || !data['ETH/USD'] || !data['SOL/USD']) throw new Error('Twelve Data rate limit or bad data');
  return {
    BTC: parseFloat(data['BTC/USD'].price),
    ETH: parseFloat(data['ETH/USD'].price),
    SOL: parseFloat(data['SOL/USD'].price),
  };
}

// Rotating fetch function
async function fetchCurrentPrices() {
  const apis = [
    fetchFromCoinGecko,
    fetchFromBinance,
    fetchFromAlphaVantage,
    fetchFromTwelveData,
  ];
  for (const api of apis) {
    try {
      const prices = await api();
      console.log(`Fetched prices from ${api.name}`);
      return prices;
    } catch (err) {
      console.warn(`Failed to fetch from ${api.name}:`, err.message);
      continue;
    }
  }
  console.error('All APIs failed');
  return null;
}

setInterval(async () => {
  const prices = await fetchCurrentPrices();
  if (prices) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'prices', prices }));
      }
    });
  }
}, 5000);

// --- Portfolio endpoint ---
app.get('/api/portfolio', async (req, res) => {
  try {
    // Optionally, filter by userId if you have authentication
    // const userId = req.user.id;
    // const portfolio = await Portfolio.find({ userId });

    const portfolio = await Portfolio.find();
    // Calculate summary stats if needed
    res.json({ portfolio });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching portfolio' });
  }
});

// --- Market data endpoint ---
app.get('/api/market/data', async (req, res) => {
  try {
    const market = await Market.find();
    res.json({ market, lastUpdated: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching market data' });
  }
});

// --- Update Market Data ---
const Market = require('./models/Market');
async function updateMarketData() {
  try {
    // Example: Fetch BTC, ETH, SOL prices from CoinGecko
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd';
    const response = await fetch(url);
    const data = await response.json();

    // Upsert each market symbol
    const markets = [
      { symbol: 'BTCUSD', price: data.bitcoin.usd },
      { symbol: 'ETHUSD', price: data.ethereum.usd },
      { symbol: 'SOLUSD', price: data.solana.usd }
    ];

    for (const m of markets) {
      await Market.findOneAndUpdate(
        { symbol: m.symbol },
        { ...m, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
    }
    console.log('Market data updated');
  } catch (err) {
    console.error('Error updating market data:', err);
  }
}

// Function to broadcast market data to all WebSocket clients
async function broadcastMarketData() {
  const market = await Market.find();
  const message = JSON.stringify({
    type: 'market_data',
    market: market.map(m => ({
      symbol: m.symbol,
      price: m.price,
      change: m.change24h || 0, // or whatever field you use for change
      // add more fields as needed
    })),
  });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Update every 5 minutes
setInterval(updateMarketData, 5 * 60 * 1000); // every 5 minutes
// Run once at startup
updateMarketData();

// --- Update Portfolio Data ---
const Portfolio = require('./models/Portfolio');
async function updatePortfolioData() {
  try {
    const markets = await Market.find();
    const portfolios = await Portfolio.find();

    for (const p of portfolios) {
      const market = markets.find(m => m.symbol === p.symbol);
      if (market) {
        p.currentPrice = market.price;
        p.pnl = (market.price - p.entryPrice) * p.amount;
        p.pnlPercent = ((market.price - p.entryPrice) / p.entryPrice) * 100;
        await p.save();
      }
    }
    console.log('Portfolio data updated');
  } catch (err) {
    console.error('Error updating portfolio data:', err);
  }
}

// Update every 5 minutes, after market data
setInterval(updatePortfolioData, 5 * 60 * 1000);
// Run once at startup (after market data)
setTimeout(updatePortfolioData, 10 * 1000);

// --- Start the server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server and WebSocket running on port ${PORT}`));