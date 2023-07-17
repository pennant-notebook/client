import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from './utils/MuiImports';

import LandingPage from './components/Landing/LandingPage';
import { UserRoute } from './components/Landing/UserRoute';
import { NotebookRoute } from './components/Landing/NotebookRoute';

function App() {
  return (
    <Box sx={{ height: '100vh' }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/:username' element={<UserRoute />} />
          <Route path='/:username/:docID' element={<NotebookRoute />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
