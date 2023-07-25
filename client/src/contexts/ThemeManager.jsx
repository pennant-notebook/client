import React from 'react';
import { useMediaQuery, ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

function ThemeManager({ children, theme, toggleTheme }) {
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#FFF'
      }
    },
    custom: {
      toggleTheme,
      currTheme: 'light'
    }
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#181a1b'
      }
    },
    custom: {
      toggleTheme,
      currTheme: 'dark' // Add this
    }
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <ThemeProvider theme={theme === 'dark' || prefersDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default ThemeManager;
