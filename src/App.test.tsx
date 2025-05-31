import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { store } from './store';
import { theme } from './theme/index';
import App from './App';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {component}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

test('renders APTERRA app', () => {
  renderWithProviders(<App />);
  expect(screen.getByText(/APTERRA/i)).toBeInTheDocument();
});
