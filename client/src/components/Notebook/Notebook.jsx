import { useEffect, useReducer, useState } from 'react';
import { Box, useTheme } from '../../utils/MuiImports';
import Cells from '../Cells/Cells';
import Navbar from './Navbar';
import { NotebookContext } from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { createCell, getUserObjects } from '../../utils/notebookHelpers';
import { getClientFromLocalStorage, updateDisconnectedClient } from '../../utils/awarenessHelpers';
import { useNavigate } from 'react-router';

const Notebook = ({ docID, resourceTitle }) => {
  const { doc, provider, awareness, notebookMetadata } = useProviderContext();
  const [refreshCount, incrementRefreshCount] = useReducer(count => count + 1, 0);
  const navigate = useNavigate();
  const theme = useTheme();

  const cellsArray = doc.getArray('cells');

  const [cellDataArr, setCellDataArr] = useState(cellsArray.toArray());
  const [allRunning, setAllRunning] = useState(false);
  const [clients, setClients] = useState([]);
  const [title, setTitle] = useState(resourceTitle || docID);
  document.title = resourceTitle || 'Untitled Notebook';

  useEffect(() => {
    const cells = doc.getArray('cells');

    const observer = () => {
      setCellDataArr(cells.toArray());
    };

    cells.observe(observer);
  }, [docID]);

  useEffect(() => {
    if (!awareness) return;

    const { name, color } = getClientFromLocalStorage();

    awareness.setLocalStateField('user', { name, color });

    const updateClients = () => {
      const states = Array.from(awareness.getStates());
      const clientObjects = getUserObjects(states);
      setTimeout(() => setClients(clientObjects), 0);
    };

    awareness.on('update', updateClients);

    return () => {
      awareness.off('update', updateClients);
    };
  }, [awareness]);

  const deleteCell = async id => {
    const cellIndex = cellsArray.toArray().findIndex(c => c.get('id') === id);
    if (cellIndex !== -1) cellsArray.delete(cellIndex);
    updatePositions();
  };

  const addCellAtIndex = async (idx, type) => {
    const cell = createCell(type);
    cell.set('theme', theme.palette.mode);
    if (idx >= cellsArray.length) {
      cellsArray.push([cell]);
    } else {
      cellsArray.insert(idx + 1, [cell]);
    }
    updatePositions();
  };

  const updatePositions = () => {
    cellsArray.toArray().forEach((c, i) => c.set('pos', i));
  };

  const repositionCell = async (cell, newIndex) => {
    const clone = cell.clone();
    cell.set('id', 'delete');
    await deleteCell('delete');
    cellsArray.insert(newIndex, [clone]);
    updatePositions();
    incrementRefreshCount();
  };

  const handleTitleChange = newTitle => {
    notebookMetadata.set('title', newTitle);
    setTitle(newTitle);
  };

  useEffect(() => {
    const titleObserver = () => {
      const docTitle = notebookMetadata.get('title');
      const displayTitle = docTitle ? docTitle.toString() : 'Untitled';
      setTitle(displayTitle);
      document.title = displayTitle;
    };

    if (notebookMetadata) {
      notebookMetadata.observe(titleObserver);
    }

    return () => {
      notebookMetadata.unobserve(titleObserver);
    };
  }, [title]);

  const handleDisconnect = destination => {
    if (docID) {
      const currentClients = updateDisconnectedClient(provider);
      setClients(currentClients);
    }
    navigate(destination);
  };

  const codeCellsForDredd = cellDataArr.filter(c => c.get('type') === 'code');

  const contextValue = {
    addCellAtIndex,
    repositionCell,
    deleteCell,
    title,
    handleTitleChange,
    allRunning,
    setAllRunning,
    refreshCount,
    incrementRefreshCount
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Box className='main-content'>
        <Navbar
          codeCells={codeCellsForDredd}
          provider={provider}
          clients={clients}
          handleDisconnect={handleDisconnect}
        />
        <Cells cells={cellDataArr} setCells={setCellDataArr} />
      </Box>
    </NotebookContext.Provider>
  );
};

export default Notebook;
