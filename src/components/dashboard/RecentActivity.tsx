import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export interface RecentActivityProps {
  trades: any[];
  signals: any[];
  notifications: any[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ trades, signals, notifications }) => {
  const recentActions = [
    { id: 1, action: 'Bought BTC at $45,000' },
    { id: 2, action: 'Sold ETH at $3,200' },
    { id: 3, action: 'Opened a new Forex position: EUR/USD' },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Recent Activity</Typography>
      <List>
        {recentActions.map(({ id, action }) => (
          <ListItem key={id}>
            <ListItemText primary={action} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RecentActivity;
