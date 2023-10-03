import { Theme } from '~/utils/MuiImports';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      toggleTheme: () => void;
      currTheme: string;
    };
  }
}
