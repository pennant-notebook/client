import { useEffect, useReducer, useState } from 'react';
import { Box, useTheme } from '../../utils/MuiImports';
import Cells from '../Cells/Cells';
import Navbar from './Navbar';
import { NotebookContext } from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { createCell, getUserObjects, generateRandomName, randomColor } from '../../utils/notebookHelpers';

const Notebook = ({ docID, resourceTitle }) => {
  const { doc, provider, awareness, notebookMetadata } = useProviderContext();

  const theme = useTheme();
  const [lineRefresh, incrementLineRefresh] = useReducer(count => count + 1, 0);
  const [title, setTitle] = useState(resourceTitle || docID);

  const cellsArray = doc.getArray('cells');
  const [cellDataArr, setCellDataArr] = useState(cellsArray.toArray());

  const [clients, setClients] = useState([]);
  const [hideClients, setHideClients] = useState(true);

  const [allRunning, setAllRunning] = useState(false);

  useEffect(() => {
    const cells = doc.getArray('cells');

    const observer = () => {
      setCellDataArr(cells.toArray());
    };

    cells.observe(observer);
  }, [docID]);

  useEffect(() => {
    if (!awareness) return;

    let color, name;

    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    if (storedUserData && storedUserData.setByUser) {
      color = storedUserData.color;
      name = storedUserData.name;
    } else {
      color = randomColor();
      name = generateRandomName();
      localStorage.setItem('userData', JSON.stringify({ name, color }));
    }

    awareness.setLocalStateField('user', { name, color });

    const updateClients = () => {
      const states = Array.from(awareness.getStates());
      const clientObjects = getUserObjects(states);
      setClients(clientObjects);
      if (states.length > 1) {
        setHideClients(false);
      } else {
        setHideClients(true);
      }
    };

    awareness.on('update', updateClients);

    return () => {
      awareness.off('update', updateClients);
    };
  }, [awareness]);

  const deleteCell = async id => {
    const cellIndex = cellsArray.toArray().findIndex(c => c.get('id') === id);
    if (cellIndex !== -1) cellsArray.delete(cellIndex);
    incrementLineRefresh();
  };

  const addCellAtIndex = async (idx, type) => {
    const cell = createCell(type);
    if (idx >= cellsArray.length) {
      cellsArray.push([cell]);
    } else {
      cellsArray.insert(idx + 1, [cell]);
    }
    updatePositions();
    incrementLineRefresh();
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

  const codeCellsForDredd = cellDataArr.filter(c => c.get('type') === 'code');

  const contextValue = {
    addCellAtIndex,
    repositionCell,
    deleteCell,
    title,
    handleTitleChange,
    allRunning,
    setAllRunning,
    lineRefresh,
    incrementLineRefresh
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Box className='main-content'>
        <Navbar
          codeCells={codeCellsForDredd}
          provider={provider}
          clients={clients}
          setClients={setClients}
          hideClients={hideClients}
        />

        <Cells cells={cellDataArr} setCells={setCellDataArr} />
      </Box>
    </NotebookContext.Provider>
  );
};

export default Notebook;
