import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          component={Link}
          to="/dashboard"
          color="inherit"
        >
          Apterra Trading
        </Typography>
        <Box>
          <Button
            color={location.pathname === '/dashboard' ? 'secondary' : 'inherit'}
            component={Link}
            to="/dashboard"
          >
            Dashboard
          </Button>
          <Button
            color={location.pathname === '/signals' ? 'secondary' : 'inherit'}
            component={Link}
            to="/signals"
          >
            Signals
          </Button>
          <Button
            color={location.pathname === '/portfolio' ? 'secondary' : 'inherit'}
            component={Link}
            to="/portfolio"
          >
            Portfolio
          </Button>
          <Button
            color={location.pathname === '/settings' ? 'secondary' : 'inherit'}
            component={Link}
            to="/settings"
          >
            Settings
          </Button>
          {isAuthenticated ? (
            <Button color="inherit" onClick={() => dispatch(logout())}>Logout</Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;