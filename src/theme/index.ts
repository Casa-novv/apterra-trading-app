import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = createTheme({
  palette: {
    background: {
      default: colors.background?.default ?? '#ffffff',  // 🔹 Ensures values exist
      paper: colors.background?.paper ?? '#f3f4f6',
    },
  },
  typography: {
    ...typography,
    fontFamily: typeof typography.fontFamily === 'string'
      ? typography.fontFamily
      : 'Inter, system-ui, sans-serif',
    fontSize: typeof typography.fontSize === 'number' ? typography.fontSize : 16, // 🔹 Ensures number format
  },
  spacing: (factor: number) => {
    const key = factor as keyof typeof spacing;
    return typeof spacing[key] === 'number' ? spacing[key] : factor * 8;
  }, // 🔹 Ensures correct spacing format
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1200,
    },
  },
  shadows: [
    "none",
    ...Array.from({ length: 24 }, (_, i) => `${i + 1}px ${(i + 1) * 1.5}px ${(i + 1) * 3}px rgba(0,0,0,0.${i + 3})`)
  ] as [
    "none", string, string, string, string, string, string, string, string, string,
    string, string, string, string, string, string, string, string, string, string,
    string, string, string, string, string
  ],
  shape: {
    borderRadius: 8, // ✅ Correct placement under `shape`
  },
  zIndex: {
    modal: 1050,
    tooltip: 1070,
  },
});

export default theme;
