import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add,
  Edit,
  Delete,
  AccountBalance,
  ShowChart,
  Assessment,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';

interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  market: string;
  openDate: string;
  pnl: number;
  pnlPercentage: number;
  status: 'open' | 'closed';
}

const Portfolio: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [newPosition, setNewPosition] = useState({
    symbol: '',
    type: 'BUY' as 'BUY' | 'SELL',
    quantity: '',
    entryPrice: '',
    market: 'forex',
  });

  // Mock portfolio data
  const mockPositions: Position[] = [
    {
      id: '1',
      symbol: 'EUR/USD',
      type: 'BUY',
      quantity: 10000,
      entryPrice: 1.0850,
      currentPrice: 1.0920,
      market: 'forex',
      openDate: '2024-01-15',
      pnl: 700,
      pnlPercentage: 6.45,
      status: 'open',
    },
    {
      id: '2',
      symbol: 'BTC/USD',
      type: 'SELL',
      quantity: 0.5,
      entryPrice: 45200,
      currentPrice: 44800,
      market: 'crypto',
      openDate: '2024-01-14',
      pnl: 200,
      pnlPercentage: 0.88,
      status: 'open',
    },
    {
      id: '3',
      symbol: 'AAPL',
      type: 'BUY',
      quantity: 50,
      entryPrice: 175.50,
      currentPrice: 172.30,
      market: 'stocks',
      openDate: '2024-01-13',
      pnl: -160,
      pnlPercentage: -1.82,
      status: 'open',
    },
    {
      id: '4',
      symbol: 'GBP/USD',
      type: 'BUY',
      quantity: 5000,
      entryPrice: 1.2650,
      currentPrice: 1.2780,
      market: 'forex',
      openDate: '2024-01-10',
      pnl: 650,
      pnlPercentage: 10.28,
      status: 'closed',
    },
  ];

  const openPositions = mockPositions.filter(p => p.status === 'open');
  const closedPositions = mockPositions.filter(p => p.status === 'closed');

  // Portfolio statistics
  const totalPnL = openPositions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalInvested = openPositions.reduce((sum, pos) => sum + (pos.quantity * pos.entryPrice), 0);
  const totalValue = openPositions.reduce((sum, pos) => sum + (pos.quantity * pos.currentPrice), 0);
  const totalReturn = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;

  const handleAddPosition = () => {
    setSelectedPosition(null);
    setNewPosition({
      symbol: '',
      type: 'BUY',
      quantity: '',
      entryPrice: '',
      market: 'forex',
    });
    setOpenDialog(true);
  };

  const handleEditPosition = (position: Position) => {
    setSelectedPosition(position);
    setNewPosition({
      symbol: position.symbol,
      type: position.type,
      quantity: position.quantity.toString(),
      entryPrice: position.entryPrice.toString(),
      market: position.market,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPosition(null);
  };

  const handleSavePosition = () => {
    // Here you would dispatch an action to save the position
    console.log('Saving position:', newPosition);
    handleCloseDialog();
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative';
    icon: React.ReactNode;
  }> = ({ title, value, change, changeType, icon }) => (
    <Card 
      sx={{ 
        background: 'rgba(26, 26, 46, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            {change && (
              <Box display="flex" alignItems="center" mt={1}>
                {changeType === 'positive' ? (
                  <TrendingUp sx={{ color: '#4caf50', fontSize: 16, mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: '#f44336', fontSize: 16, mr: 0.5 }} />
                )}
                <Typography 
                  variant="caption" 
                  sx={{ color: changeType === 'positive' ? '#4caf50' : '#f44336' }}
                >
                  {change}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color: '#00d4aa', opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Portfolio
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Track and manage your trading positions
        </Typography>
      </Box>

      {/* Portfolio Statistics */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Value"
            value={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<AccountBalance sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total P&L"
            value={`$${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            change={`${totalReturn.toFixed(2)}%`}
            changeType={totalPnL >= 0 ? 'positive' : 'negative'}
            icon={<ShowChart sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Open Positions"
            value={openPositions.length.toString()}
            icon={<Assessment sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Success Rate"
            value="78.5%"
            change="+5.2%"
            changeType="positive"
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>

      {/* Open Positions */}
      <Paper 
        sx={{ 
          mb: 4,
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ color: '#00d4aa', fontWeight: 'bold' }}>
            Open Positions
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddPosition}
            sx={{
              background: 'linear-gradient(45deg, #00d4aa 30%, #00a085 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00a085 30%, #008066 90%)',
              }
            }}
          >
            Add Position
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Symbol</TableCell>
                <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Entry Price</TableCell>
                <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Current Price</TableCell>
                <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>P&L</TableCell>
                <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>P&L %</TableCell>
                <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {openPositions.map((position) => (
                <TableRow 
                  key={position.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 212, 170, 0.05)' 
                    }
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {position.symbol}
                      </Typography>
                      <Chip 
                        label={position.market.toUpperCase()}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1, fontSize: '0.7rem' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={position.type}
                      color={position.type === 'BUY' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {position.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {position.entryPrice.toFixed(position.market === 'forex' ? 4 : 2)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {position.currentPrice.toFixed(position.market === 'forex' ? 4 : 2)}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold',
                      color: position.pnl >= 0 ? '#4caf50' : '#f44336'
                    }}
                  >
                    ${position.pnl.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(Math.abs(position.pnlPercentage), 100)}
                        sx={{
                          width: 60,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: position.pnlPercentage >= 0 ? '#4caf50' : '#f44336',
                            borderRadius: 3,
                          }
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: position.pnlPercentage >= 0 ? '#4caf50' : '#f44336',
                          fontWeight: 'bold',
                          minWidth: '50px'
                        }}
                      >
                        {position.pnlPercentage.toFixed(2)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditPosition(position)}
                        sx={{ color: '#00d4aa' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#f44336' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {openPositions.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              No open positions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Add your first position to start tracking your portfolio
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Position Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#00d4aa' }}>
          {selectedPosition ? 'Edit Position' : 'Add New Position'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Symbol"
                value={newPosition.symbol}
                onChange={(e) => setNewPosition(prev => ({ ...prev, symbol: e.target.value }))}
                placeholder="e.g., EUR/USD, AAPL, BTC/USD"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Market</InputLabel>
                <Select
                  value={newPosition.market}
                  label="Market"
                  onChange={(e) => setNewPosition(prev => ({ ...prev, market: e.target.value }))}
                >
                  <MenuItem value="forex">Forex</MenuItem>
                  <MenuItem value="stocks">Stocks</MenuItem>
                  <MenuItem value="crypto">Crypto</MenuItem>
                  <MenuItem value="commodities">Commodities</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newPosition.type}
                  label="Type"
                  onChange={(e) => setNewPosition(prev => ({ ...prev, type: e.target.value as 'BUY' | 'SELL' }))}
                >
                  <MenuItem value="BUY">Buy</MenuItem>
                  <MenuItem value="SELL">Sell</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={newPosition.quantity}
                onChange={(e) => setNewPosition(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Entry Price"
                type="number"
                value={newPosition.entryPrice}
                onChange={(e) => setNewPosition(prev => ({ ...prev, entryPrice: e.target.value }))}
                inputProps={{ step: "0.0001" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSavePosition}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #00d4aa 30%, #00a085 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00a085 30%, #008066 90%)',
              }
            }}
          >
            {selectedPosition ? 'Update' : 'Add'} Position
          </Button>
        </DialogActions>
      </Dialog>

      {/* Trading History */}
      {closedPositions.length > 0 && (
        <Paper 
          sx={{ 
            background: 'rgba(26, 26, 46, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box p={3}>
            <Typography variant="h5" sx={{ color: '#00d4aa', fontWeight: 'bold' }}>
              Trading History
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Symbol</TableCell>
                  <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Quantity</TableCell>
                  <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Entry Price</TableCell>
                  <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Exit Price</TableCell>
                  <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>P&L</TableCell>
                  <TableCell sx={{ color: '#00d4aa', fontWeight: 'bold' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {closedPositions.map((position) => (
                  <TableRow 
                    key={position.id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(0, 212, 170, 0.05)' 
                      }
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {position.symbol}
                        </Typography>
                        <Chip 
                          label={position.market.toUpperCase()}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1, fontSize: '0.7rem' }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={position.type}
                        color={position.type === 'BUY' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {position.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {position.entryPrice.toFixed(position.market === 'forex' ? 4 : 2)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {position.currentPrice.toFixed(position.market === 'forex' ? 4 : 2)}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold',
                        color: position.pnl >= 0 ? '#4caf50' : '#f44336'
                      }}
                    >
                      ${position.pnl.toFixed(2)} ({position.pnlPercentage.toFixed(2)}%)
                    </TableCell>
                    <TableCell>
                      {new Date(position.openDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default Portfolio;
export {};