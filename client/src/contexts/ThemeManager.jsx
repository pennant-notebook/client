import { createContext, useContext } from 'react';
import { useMediaQuery, ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { oneDark } from '@codemirror/theme-one-dark';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { dracula } from '@uiw/codemirror-theme-dracula';

export const codeMirrorThemes = [
  { name: 'Dracula', theme: dracula },
  { name: 'One Dark', theme: oneDark },
  { name: 'Tokyo Night', theme: tokyoNight },
  { name: 'VSCode Dark', theme: vscodeDark }
];

export const CodeMirrorThemeContext = createContext();
export const useCMThemeContext = () => useContext(CodeMirrorThemeContext);

function ThemeManager({ children, theme, toggleTheme, toggleCMTheme, editorTheme }) {
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
      currTheme: 'dark'
    }
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <CodeMirrorThemeContext.Provider value={{ editorTheme, toggleCMTheme, codeMirrorThemes }}>
      <ThemeProvider theme={theme === 'dark' || prefersDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CodeMirrorThemeContext.Provider>
  );
}

export default ThemeManager;
