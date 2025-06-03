import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
}

interface MarketOverviewProps {
  data: MarketData[];
  compact?: boolean;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ data, compact }) => {
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