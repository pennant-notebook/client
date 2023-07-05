import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { Box } from '@mui/material';
import { initializeYDoc, initializeProvider } from './notebookHelpers';

const Notebook = lazy(() => import('./Notebook'));
  const ydoc = initializeYDoc();
  const provider = initializeProvider(ydoc, 'LADYGAGA');
const Room = () => {


  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Notebook doc={ydoc} provider={provider} />
    </Suspense>
  );
};

function App() {
  return (
    <Box sx={{ height: '100vh', overflowY: 'scroll' }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Room />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;