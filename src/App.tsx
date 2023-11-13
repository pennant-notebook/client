import { Extension } from '@codemirror/state';
import { useMediaQuery } from '~/utils/MuiImports';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Auth from './components/Auth/Auth';
import DashboardWrapper from './components/Dashboard/DashboardWrapper';
import HomePage from './components/Landing/home/HomePage';
import NotebookRoute from './components/Notebook/NotebookRoute';
import ThemeManager, { codeMirrorThemes } from './contexts/ThemeManager';
import { Box } from './utils/MuiImports';
import ResetPassword from './components/Auth/ResetPassword';

interface CodeMirrorThemeType {
  name: string;
  theme: Extension;
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [theme, setTheme] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  const [editorTheme, setEditorTheme] = useState<CodeMirrorThemeType>(codeMirrorThemes[0]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleCMTheme = (theme: CodeMirrorThemeType) => {
    setEditorTheme(theme);
  };

  return (
    <ThemeManager theme={theme} toggleTheme={toggleTheme} editorTheme={editorTheme} toggleCMTheme={toggleCMTheme}>
      <Box sx={{ height: '100vh' }}>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path='/auth' element={<Auth />} />
            <Route path='/auth/github' element={<Auth />} />
            <Route path='/auth/google' element={<Auth />} />
            <Route path='/reset-password/:resetToken' element={<ResetPassword />} />
            <Route path='/:username/:docID' element={<NotebookRoute />} />
            <Route path='/:username' element={<DashboardWrapper />} />
            <Route path='/' element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeManager>
  );
}

export default App;
