import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from './utils/MuiImports';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserDashboard from './components/Landing/UserDashboard';
import NotebookRoute from './components/Landing/NotebookRoute';
import ThemeManager from './contexts/ThemeManager';
import { useState } from 'react';
import { codeMirrorThemes } from './contexts/ThemeManager';
import { useMediaQuery } from '@mui/material';
import LandingPage from './components/Landing/LandingPage';
import Auth from './components/Auth/Auth';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [theme, setTheme] = useState(prefersDarkMode ? 'dark' : 'light');
  const [editorTheme, setEditorTheme] = useState(codeMirrorThemes[0]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleCMTheme = theme => {
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
            <Route path='/:username/:docID' element={<NotebookRoute />} />
            <Route path='/:username' element={<UserDashboard />} />
            <Route path='/' element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeManager>
  );
}

export default App;
