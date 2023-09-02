import { createContext, useContext, useEffect, useState } from 'react';
import { createTheme, useMediaQuery, ThemeProvider } from '../utils/MuiImports';
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
        default: '#fff'
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

  // const [manuallyToggled, setManuallyToggled] = useState(false);

  // useEffect(() => {
  //   setManuallyToggled(true);
  // }, [theme]);

  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // const chosenTheme = manuallyToggled ? theme : prefersDarkMode ? 'dark' : 'light';

  return (
    <CodeMirrorThemeContext.Provider value={{ editorTheme, toggleCMTheme, codeMirrorThemes }}>
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CodeMirrorThemeContext.Provider>
  );
}

export default ThemeManager;
