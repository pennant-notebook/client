import React from 'react';
import { useMediaQuery, ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

function ThemeManager({ children }) {
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#FFF'
      }
    }
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#181a1b'
      }
    }
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default ThemeManager;
