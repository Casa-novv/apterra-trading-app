import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    full: string;
  };
  zIndex: {
    dropdown: number;
    modal: number;
    tooltip: number;
    overlay: number;
  };
}

export const theme: Theme = {
  colors,
  typography,
  spacing,
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    large: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    full: '50%',
  },
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    tooltip: 1070,
    overlay: 1040,
  },
};

export default theme;
export {}