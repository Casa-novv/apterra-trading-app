import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { formatCurrency, formatPercentage } from './formatters';

interface DashboardStatsProps {
  metrics: {
    totalValue: number;
    dailyPnL: number;
    dailyPnLPercentage: number;
    totalPnL: number;
    totalPnLPercentage: number;
    activePositions: number;
    todayTrades: number;
    winRate: number;
    activeSignals: number;
    signalAccuracy: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ metrics }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Quick Stats
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total P&L
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography 
                variant="h6"
                color={metrics.totalPnL >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(metrics.totalPnL)}
              </Typography>
              {metrics.totalPnL >= 0 ? <TrendingUp /> : <TrendingDown />}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Win Rate
            </Typography>
            <Typography variant="h6">
              {formatPercentage(metrics.winRate)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DashboardStats;