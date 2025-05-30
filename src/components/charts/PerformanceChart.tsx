import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

interface PerformanceChartProps {
  data: any; // or the correct type for your chart data
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
  height: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, timeframe, height }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Portfolio Performance',
        data: [100, 110, 90, 120, 130],
        fill: false,
        borderColor: 'rgba(0, 212, 255, 1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Portfolio Performance</Typography>
      <div style={{ height }}>
        <Line data={chartData} />
      </div>
    </Box>
  );
};

export default PerformanceChart;
