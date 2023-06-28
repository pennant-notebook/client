import { useState, useEffect, React, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShortUniqueId from 'short-unique-id';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { Box } from '@mui/material';

const CodeEditor = lazy(() => import('./CodeEditor'));

const uuid = new ShortUniqueId({ length: 6 });

function App() {
  const [roomID, setRoomID] = useState('');

  useEffect(() => {
    const url = window.location.pathname;
    const pathSegments = url.split('/').filter(segment => segment.trim() !== '');

    if (pathSegments.length === 1 && pathSegments[0].length === 6) {
      setRoomID(pathSegments[0]);
    } else {
      const newRoomID = uuid();
      setRoomID(newRoomID);
      const newUrl = `/${newRoomID}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  return (
    <Box sx={{ height: '100vh', overflowY: 'scroll' }}>
      <BrowserRouter>
        <Routes>
          <Route
            path='/:uuid'
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CodeEditor key={roomID} roomID={roomID} />
              </Suspense>
            }
          />
          <Route
            path='/'
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CodeEditor key={roomID} roomID={roomID} />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
