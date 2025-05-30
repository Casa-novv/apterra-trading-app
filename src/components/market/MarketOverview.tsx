import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export interface MarketData {
  // Define the shape of your market data here, for example:
  symbol: string;
  price: number;
  change: number;
  // ...add other fields as needed
}

interface MarketOverviewProps {
  data: MarketData[];
  compact?: boolean;
}

const marketData = [
  { symbol: 'Bitcoin', price: '$45,000', change: '+2.5%' },
  { symbol: 'Ethereum', price: '$3,200', change: '-1.3%' },
  { symbol: 'Gold', price: '$1,890', change: '+0.6%' },
];

const MarketOverview: React.FC<MarketOverviewProps> = ({ data = marketData, compact }) => {
  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Market Overview</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(({ symbol, price, change }) => (
              <TableRow key={symbol}>
                <TableCell>{symbol}</TableCell>
                <TableCell>{price}</TableCell>
                <TableCell>{change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MarketOverview;