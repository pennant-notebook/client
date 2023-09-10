import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      toggleTheme: () => void;
      currTheme: string;
    };
  }
}
