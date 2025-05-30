import React from 'react';
import Grid from '@mui/material/Grid'; // ✅ fix
import { Paper, Typography, Button, Box } from '@mui/material';
import { Add, TrendingUp, Assessment, Settings } from '@mui/icons-material';

const QuickActions: React.FC = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 6 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            size="small"
            href="/signals/create"
          >
            New Signal
          </Button>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<TrendingUp />}
            size="small"
            href="/portfolio"
          >
            Portfolio
          </Button>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Assessment />}
            size="small"
            href="/analytics"
          >
            Analytics
          </Button>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Settings />}
            size="small"
            href="/settings"
          >
            Settings
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default QuickActions;
export {};