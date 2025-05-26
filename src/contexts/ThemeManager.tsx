import { createContext, useContext, ReactNode } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '../utils/MuiImports';
import { oneDark } from '@codemirror/theme-one-dark';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { Extension } from '@codemirror/state';

export const codeMirrorThemes = [
  { name: 'Dracula', theme: dracula },
  { name: 'One Dark', theme: oneDark },
  { name: 'Tokyo Night', theme: tokyoNight },
  { name: 'VSCode Dark', theme: vscodeDark }
];

export interface CodeMirrorThemeType {
  name: string;
  theme: Extension;
}

export interface CodeMirrorThemeContextType {
  editorTheme: CodeMirrorThemeType;
  toggleCMTheme: (theme: CodeMirrorThemeType) => void;
  codeMirrorThemes: CodeMirrorThemeType[];
}

export const CodeMirrorThemeContext = createContext<CodeMirrorThemeContextType | null>(null);
export const useCMThemeContext = () => useContext(CodeMirrorThemeContext);

interface ThemeManagerProps {
  children: ReactNode;
  theme: string;
  toggleTheme: () => void;
  toggleCMTheme: (theme: CodeMirrorThemeType) => void;
  editorTheme: CodeMirrorThemeType;
}

function ThemeManager({ children, theme, toggleTheme, toggleCMTheme, editorTheme }: ThemeManagerProps) {
  const customLight = {
    custom: {
      toggleTheme,
      currTheme: 'light'
    }
  };

  const customDark = {
    custom: {
      toggleTheme,
      currTheme: 'light'
    }
  };

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#fff'
      }
    },
    ...customLight
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212'
      }
    },
    ...customDark
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
