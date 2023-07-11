import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ShortUniqueId from 'short-unique-id';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { Box } from './components/MuiImports';
import './App.css';
import { ProviderContext, initializeProvider } from './contexts/ProviderContext';

const Notebook = lazy(() => import('./components/Notebook/Notebook'));
const uuid = new ShortUniqueId({ length: 6 });

const Room = () => {
  const location = useLocation();
  let roomID = location.pathname.slice(1);
  if (!roomID || roomID.length !== 6) {
    roomID = uuid();
    const newUrl = `/${roomID}`;
    window.history.replaceState(null, '', newUrl);
  }

  const contextValue = initializeProvider(roomID);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProviderContext.Provider value={contextValue}>
        <Notebook roomID={roomID} />
      </ProviderContext.Provider>
    </Suspense>
  );
};

function App() {
  return (
    <Box sx={{ height: '100vh', overflowY: 'scroll' }}>
      <BrowserRouter>
        <Routes>
          <Route path='/:uuid' element={<Room />} />
          <Route path='/' element={<Room />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
