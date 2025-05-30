import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  TrendingUp,
  TrendingDown,
  FilterList,
  Refresh,
  Info,
  Star,
  StarBorder,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import fetchSignals from '../store/slices/signalSlice';

const Signals: React.FC = () => {
  const dispatch = useAppDispatch();
  // Import RootState from your store if not already imported
  // import { RootState } from '../store';
  
    const { signals, loading, error } = useAppSelector((state: any) => state.signals);
  // Replace 'any' with 'RootState' if you have a RootState type, e.g.:
  // const { signals, loading, error } = useAppSelector((state: RootState) => state.signals);
  
  const [filters, setFilters] = useState({
    market: 'all',
    type: 'all',
    confidence: 'all',
    timeframe: 'all',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteSignals, setFavoriteSignals] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchSignals());
  }, [dispatch]);

  // Mock signals data for demonstration
  const mockSignals = [
    {
      id: '1',
      symbol: 'EUR/USD',
      type: 'BUY',
      confidence: 92,
      entryPrice: 1.0850,
      targetPrice: 1.0920,
      stopLoss: 1.0800,
      timeframe: '4H',
      market: 'forex',
      timestamp: new Date().toISOString(),
      status: 'active',
      description: 'Strong bullish momentum with RSI oversold bounce',
    },
    {
      id: '2',
      symbol: 'BTC/USD',
      type: 'SELL',
      confidence: 88,
      entryPrice: 45200,
      targetPrice: 43800,
      stopLoss: 46000,
      timeframe: '1H',
      market: 'crypto',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'active',
      description: 'Bearish divergence on RSI with resistance at key level',
    },
    {
      id: '3',
      symbol: 'AAPL',
      type: 'BUY',
      confidence: 76,
      entryPrice: 175.50,
      targetPrice: 182.00,
      stopLoss: 170.00,
      timeframe: '1D',
      market: 'stocks',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'pending',
      description: 'Breakout above resistance with strong volume',
    },
  ];

  const filteredSignals = mockSignals.filter(signal => {
    const matchesSearch = signal.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMarket = filters.market === 'all' || signal.market === filters.market;
    const matchesType = filters.type === 'all' || signal.type.toLowerCase() === filters.type;
    const matchesConfidence = filters.confidence === 'all' || 
      (filters.confidence === 'high' && signal.confidence >= 80) ||
      (filters.confidence === 'medium' && signal.confidence >= 60 && signal.confidence < 80) ||
      (filters.confidence === 'low' && signal.confidence < 60);
    const matchesTimeframe = filters.timeframe === 'all' || signal.timeframe === filters.timeframe;

    return matchesSearch && matchesMarket && matchesType && matchesConfidence && matchesTimeframe;
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const toggleFavorite = (signalId: string) => {
    setFavoriteSignals(prev => 
      prev.includes(signalId) 
        ? prev.filter(id => id !== signalId)
        : [...prev, signalId]
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#4caf50';
    if (confidence >= 60) return '#ff9800';
    return '#f44336';
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Trading Signals
        </Typography>
        <Typography variant="h6" color="text.secondary">
          AI-powered trading signals across multiple markets
        </Typography>
      </Box>

      {/* Filters */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3,
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <FilterList sx={{ mr: 1, color: '#00d4aa' }} />
          <Typography variant="h6" sx={{ color: '#00d4aa' }}>
            Filters
          </Typography>
          <Box ml="auto">
            <Button
              startIcon={<Refresh />}
              onClick={() => dispatch(fetchSignals())}
              sx={{ color: '#00d4aa' }}
            >
              Refresh
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              fullWidth
              label="Search Symbol"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Market</InputLabel>
              <Select
                value={filters.market}
                label="Market"
                onChange={(e) => handleFilterChange('market', e.target.value)}
              >
                <MenuItem value="all">All Markets</MenuItem>
                <MenuItem value="forex">Forex</MenuItem>
                <MenuItem value="stocks">Stocks</MenuItem>
                <MenuItem value="crypto">Crypto</MenuItem>
                <MenuItem value="commodities">Commodities</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Signal Type</InputLabel>
              <Select
                value={filters.type}
                label="Signal Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="buy">Buy</MenuItem>
                <MenuItem value="sell">Sell</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Confidence</InputLabel>
              <Select
                value={filters.confidence}
                label="Confidence"
                onChange={(e) => handleFilterChange('confidence', e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="high">High (80%+)</MenuItem>
                <MenuItem value="medium">Medium (60-79%)</MenuItem>
                <MenuItem value="low">Low (&lt;60%)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={filters.timeframe}
                label="Timeframe"
                onChange={(e) => handleFilterChange('timeframe', e.target.value)}
              >
                <MenuItem value="all">All Timeframes</MenuItem>
                <MenuItem value="15M">15 Minutes</MenuItem>
                <MenuItem value="1H">1 Hour</MenuItem>
                <MenuItem value="4H">4 Hours</MenuItem>
                <MenuItem value="1D">1 Day</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Signal Cards for Mobile */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {filteredSignals.map((signal) => (
          <Card 
            key={signal.id}
            sx={{ 
              mb: 2,
              background: 'rgba(26, 26, 46, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {signal.symbol}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip 
                    label={signal.type}
                    color={signal.type === 'BUY' ? 'success' : 'error'}
                    size="small"
                  />
                  <IconButton 
                    size="small"
                    onClick={() => toggleFavorite(signal.id)}
                    sx={{ color: favoriteSignals.includes(signal.id) ? '#ff9800' : 'inherit' }}
                  >
                    {favoriteSignals.includes(signal.id) ? <Star /> : <StarBorder />}
                  </IconButton>
                </Box>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Confidence Level
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={signal.confidence}
                    sx={{
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getConfidenceColor(signal.confidence),
                        borderRadius: 4,
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: getConfidenceColor(signal.confidence) }}>
                    {signal.confidence}%
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6}}>
                  <Typography variant="body2" color="text.secondary">Entry</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {signal.entryPrice}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6}}>
                  <Typography variant="body2" color="text.secondary">Target</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {signal.targetPrice}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6}}>
                  <Typography variant="body2" color="text.secondary">Stop Loss</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                    {signal.stopLoss}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6}}>
                  <Typography variant="body2" color="text.secondary">Timeframe</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {signal.timeframe}
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  {signal.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getTimeAgo(signal.timestamp)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Signal Table for Desktop */}
      <TableContainer 
        component={Paper}
        sx={{ 
          display: { xs: 'none', md: 'block' },
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Symbol</TableCell>
              <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Confidence</TableCell>
              <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Entry Price</TableCell>
              <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Target</TableCell>
              <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Stop Loss</TableCell>
              <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Timeframe</TableCell>
              <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Time</TableCell>
              <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSignals.map((signal) => (
              <TableRow 
                key={signal.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 212, 170, 0.05)' 
                  }
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {signal.symbol}
                    </Typography>
                    <Chip 
                      label={signal.market.toUpperCase()}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1, fontSize: '0.7rem' }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {signal.type === 'BUY' ? (
                      <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                    ) : (
                      <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                    )}
                    <Chip 
                      label={signal.type}
                      color={signal.type === 'BUY' ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinearProgress 
                      variant="determinate" 
                      value={signal.confidence}
                      sx={{
                        width: 60,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getConfidenceColor(signal.confidence),
                          borderRadius: 3,
                        }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: getConfidenceColor(signal.confidence),
                        fontWeight: 'bold',
                        minWidth: '35px'
                      }}
                    >
                      {signal.confidence}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {signal.entryPrice}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  {signal.targetPrice}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#f44336' }}>
                  {signal.stopLoss}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={signal.timeframe}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {getTimeAgo(signal.timestamp)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Add to favorites">
                      <IconButton 
                        size="small"
                        onClick={() => toggleFavorite(signal.id)}
                        sx={{ color: favoriteSignals.includes(signal.id) ? '#ff9800' : 'inherit' }}
                      >
                        {favoriteSignals.includes(signal.id) ? <Star /> : <StarBorder />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Signal details">
                      <IconButton size="small" sx={{ color: '#00d4aa' }}>
                        <Info />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredSignals.length === 0 && (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'rgba(26, 26, 46, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No signals found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your filters or check back later for new signals
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Signals;
export {}