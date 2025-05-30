import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Button,
  Alert,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
  Notifications,
  Refresh,
  Settings,
  Timeline,
  Assessment,
  Speed,
  Warning,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import useWebSocket, { useMarketData, useTradingSignals } from '../hooks/useWebSocket';
import {
  fetchSignals,
  selectActiveSignals,
  selectSignalStats,
  selectHighConfidenceSignals,
  selectTodaysSignals,
 } from '../store/slices/signalSlice';
import {
  fetchMarketData,
  selectWatchlistData,
  selectConnectionStatus,
} from '../store/slices/marketSlice';
import {
  selectPortfolioSummary,
  selectRecentTrades,
  selectPortfolioPerformance,
  fetchPortfolio,
} from '../store/slices/portfolioSlice';
import {
  selectNotifications,
  selectUnreadCount,
} from '../store/slices/notificationsSlice';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatters';

// Dashboard Components
import DashboardStats from '../utils/DashboardStats';
import QuickActions from '../utils/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import PerformanceChart from '../components/charts/PerformanceChart';
import SignalCard from '../components/signals/SignalCard';
import MarketOverview from '../components/market/MarketOverview';

interface DashboardMetrics {
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
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const activeSignals = useAppSelector(selectActiveSignals) as Array<any>;
  interface SignalStats {
    winRate?: number;
    avgConfidence?: number;
    [key: string]: any;
  }
  const signalStats: SignalStats = useAppSelector(selectSignalStats);
  const highConfidenceSignals = useAppSelector(selectHighConfidenceSignals(85)) as Array<any>;
  const todaysSignals = useAppSelector(selectTodaysSignals);
  const watchlistData = useAppSelector(selectWatchlistData);
  const portfolioSummary = useAppSelector(selectPortfolioSummary);
  const recentTrades = useAppSelector(selectRecentTrades);
  const portfolioPerformance = useAppSelector(selectPortfolioPerformance);
  const notifications = useAppSelector((state) => selectNotifications(state));
  const unreadCount = useAppSelector(selectUnreadCount);
  const isMarketConnected = useAppSelector(selectConnectionStatus);
  
  // Loading states
  const signalsLoading = useAppSelector((state: any) => state.signals.loading.signals);
  const marketLoading = useAppSelector(state => state.market.loading.marketData);
  const portfolioLoading = useAppSelector(state => state.portfolio.loading);
  
  // WebSocket connections
  const { isConnected: wsConnected } = useWebSocket();
  const { marketData } = useMarketData(['EURUSD', 'GBPUSD', 'BTCUSD', 'ETHUSD']);
  const { signals: liveSignals } = useTradingSignals();
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  
  // Calculate dashboard metrics
  const dashboardMetrics: DashboardMetrics = React.useMemo(() => {
    return {
      totalValue: portfolioSummary?.totalValue || 0,
      dailyPnL: portfolioSummary?.dailyPnL || 0,
      dailyPnLPercentage: portfolioSummary?.dailyPnLPercentage || 0,
      totalPnL: portfolioSummary?.totalPnL || 0,
      totalPnLPercentage: portfolioSummary?.totalPnLPercentage || 0,
      activePositions: Array.isArray(portfolioSummary?.activePositions)
        ? portfolioSummary.activePositions.length
        : (portfolioSummary?.activePositions || 0),
      todayTrades: recentTrades?.filter(trade => {
        const today = new Date().toDateString();
        return new Date(trade.executedAt).toDateString() === today;
      }).length || 0,
      winRate: typeof signalStats?.winRate === 'number' ? signalStats.winRate : 0,
      activeSignals: activeSignals.length,
      signalAccuracy: signalStats?.avgConfidence || 0,
    };
  }, [portfolioSummary, recentTrades, signalStats, activeSignals]);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSignals({ limit: 20, status: 'active' }));
      dispatch(fetchMarketData(['EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD', 'ETHUSD']));
      dispatch(fetchPortfolio());
    }
  }, [dispatch, isAuthenticated]);
 
  // Refresh all data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchSignals({ limit: 20, status: 'active' })),
        dispatch(fetchMarketData(['EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD', 'ETHUSD'])),
        dispatch(fetchPortfolio()),
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Connection status indicator
  const getConnectionStatus = () => {
    if (wsConnected && isMarketConnected) {
      return { status: 'connected', color: 'success', text: 'Live Data' };
    } else if (wsConnected || isMarketConnected) {
      return { status: 'partial', color: 'warning', text: 'Partial Connection' };
    } else {
      return { status: 'disconnected', color: 'error', text: 'Disconnected' };
    }
  };
  
  const connectionStatus = getConnectionStatus();
  
  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Please log in to access your dashboard.
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {user?.firstName || 'Trader'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              icon={connectionStatus.status === 'connected' ? <CheckCircle /> : 
                    connectionStatus.status === 'partial' ? <Warning /> : <ErrorIcon />}
              label={connectionStatus.text}
              color={connectionStatus.color as any}
              variant="outlined"
            />
            <IconButton 
              onClick={handleRefresh} 
              disabled={refreshing}
              sx={{ 
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                }
              }}
            >
              <Refresh />
            </IconButton>
            <IconButton>
              <Settings />
            </IconButton>
          </Box>
        </Box>
        
        {/* Notifications Bar */}
        {unreadCount > 0 && (
          <Alert 
            severity="info" 
            icon={<Notifications />}
            sx={{ mb: 2 }}
          >
            You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </Alert>
        )}
      </Box>
      
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Portfolio Value
                  </Typography>
                  {portfolioLoading ? (
                    <Skeleton width={120} height={32} />
                  ) : (
                    <Typography variant="h5" component="div">
                      {formatCurrency(dashboardMetrics.totalValue)}
                    </Typography>
                  )}
                </Box>
                <AccountBalance color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Daily P&L
                  </Typography>
                  {portfolioLoading ? (
                    <Skeleton width={120} height={32} />
                  ) : (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography 
                        variant="h5" 
                        component="div"
                        color={dashboardMetrics.dailyPnL >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(dashboardMetrics.dailyPnL)}
                      </Typography>
                      {dashboardMetrics.dailyPnL >= 0 ? <TrendingUp /> : <TrendingDown />}
                    </Box>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {formatPercentage(dashboardMetrics.dailyPnLPercentage)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Active Signals
                  </Typography>
                  {signalsLoading ? (
                    <Skeleton width={60} height={32} />
                  ) : (
                    <Typography variant="h5" component="div">
                      {dashboardMetrics.activeSignals}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {highConfidenceSignals.length} high confidence
                  </Typography>
                </Box>
                <Timeline color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Win Rate
                  </Typography>
                  {signalsLoading ? (
                    <Skeleton width={80} height={32} />
                  ) : (
                    <Typography variant="h5" component="div">
                      {formatPercentage(dashboardMetrics.winRate)}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Avg. Confidence: {formatPercentage(dashboardMetrics.signalAccuracy)}
                  </Typography>
                </Box>
                <Assessment color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Portfolio Performance Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Portfolio Performance</Typography>
              <Box>
                {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
                  <Button
                    key={tf}
                    size="small"
                    variant={timeframe === tf ? 'contained' : 'text'}
                    onClick={() => setTimeframe(tf)}
                    sx={{ ml: 1 }}
                  >
                    {tf}
                  </Button>
                ))}
              </Box>
            </Box>
            {portfolioLoading ? (
              <LoadingSpinner message="Loading performance data..." />
            ) : (
              <PerformanceChart 
                data={portfolioPerformance} 
                timeframe={timeframe}
                height={320}
              />
            )}
          </Paper>
        </Grid>
        
        {/* Quick Actions & Stats */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <QuickActions />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <DashboardStats metrics={dashboardMetrics} />
            </Grid>
          </Grid>
        </Grid>
        
        {/* Active Signals */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Active Signals</Typography>
              <Button 
                variant="outlined" 
                size="small"
                href="/signals"
              >
                View All
              </Button>
            </Box>
            {signalsLoading ? (
              <LoadingSpinner message="Loading signals..." />
            ) : activeSignals.length === 0 ? (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center"
                minHeight={200}
                color="text.secondary"
              >
                <Speed sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">No active signals</Typography>
                <Typography variant="body2">New signals will appear here</Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {activeSignals.slice(0, 5).map((signal) => (
                  <Box key={signal.id} sx={{ mb: 2 }}>
                    <SignalCard signal={signal} compact />
                  </Box>
                ))}
                {activeSignals.length > 5 && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    +{activeSignals.length - 5} more signals
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Market Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Market Overview</Typography>
              <Button 
                variant="outlined" 
                size="small"
                href="/market"
              >
                View Market
              </Button>
            </Box>
            {marketLoading ? (
              <LoadingSpinner message="Loading market data..." />
            ) : (
              <MarketOverview data={watchlistData} compact />
            )}
          </Paper>
        </Grid>
        
        {/* Recent Activity */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <RecentActivity 
              trades={recentTrades?.slice(0, 10) || []}
              signals={todaysSignals as any[]}
              notifications={notifications.slice(0, 5)}
            />
          </Paper>
        </Grid>
        
        {/* Today's Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Today's Summary
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Trades Executed
                </Typography>
                <Typography variant="h6">
                  {dashboardMetrics.todayTrades}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Signals Generated
                </Typography>
                <Typography variant="h6">
                  {(todaysSignals as any[]).length}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Active Positions
                </Typography>
                <Typography variant="h6">
                  {dashboardMetrics.activePositions}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Portfolio Change
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography 
                    variant="h6"
                    color={dashboardMetrics.dailyPnL >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(dashboardMetrics.dailyPnL)}
                  </Typography>
                  {dashboardMetrics.dailyPnL >= 0 ? 
                    <TrendingUp color="success" /> : 
                    <TrendingDown color="error" />
                  }
                </Box>
              </Box>
              
              {/* Performance Indicator */}
              <Box 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  borderRadius: 2,
                  backgroundColor: alpha(
                    dashboardMetrics.dailyPnL >= 0 ? 
                      theme.palette.success.main : 
                      theme.palette.error.main, 
                    0.1
                  ),
                  border: `1px solid ${alpha(
                    dashboardMetrics.dailyPnL >= 0 ? 
                      theme.palette.success.main : 
                      theme.palette.error.main, 
                    0.2
                  )}`
                }}
              >
                <Typography 
                  variant="body2" 
                  color={dashboardMetrics.dailyPnL >= 0 ? 'success.main' : 'error.main'}
                  fontWeight="medium"
                  align="center"
                >
                  {dashboardMetrics.dailyPnL >= 0 ? '📈' : '📉'} 
                  {dashboardMetrics.dailyPnL >= 0 ? ' Profitable Day' : ' Loss Day'}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 0.5 }}
                >
                  {formatPercentage(dashboardMetrics.dailyPnLPercentage)} change
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* System Status */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: wsConnected ? 'success.main' : 'error.main',
                    }}
                  />
                  <Typography variant="body2">
                    WebSocket: {wsConnected ? 'Connected' : 'Disconnected'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: isMarketConnected ? 'success.main' : 'error.main',
                    }}
                  />
                  <Typography variant="body2">
                    Market Data: {isMarketConnected ? 'Live' : 'Delayed'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: 'success.main',
                    }}
                  />
                  <Typography variant="body2">
                    Trading Engine: Active
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: activeSignals.length > 0 ? 'success.main' : 'warning.main',
                    }}
                  />
                  <Typography variant="body2">
                    Signal Generation: {activeSignals.length > 0 ? 'Active' : 'Standby'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {/* Last Update Info */}
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                Last updated: {new Date().toLocaleTimeString()} • 
                Auto-refresh: {wsConnected ? 'Enabled' : 'Disabled'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Quick Action Floating Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<ShowChart />}
          sx={{
            borderRadius: 8,
            px: 3,
            py: 1.5,
            boxShadow: theme.shadows[8],
            '&:hover': {
              boxShadow: theme.shadows[12],
            },
          }}
          href="/signals"
        >
          New Trade
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
export {};