import { useEffect, useState } from 'react';
import { Box } from '../../utils/MuiImports';
import Cells from '../Cells/Cells';
import Navbar from './Navbar';
import { NotebookContext } from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { createCell, getUserObjects, generateRandomName, randomColor } from '../../utils/notebookHelpers';

const Notebook = ({ docID }) => {
  const [title, setTitle] = useState(docID);
  const { doc, provider, awareness, notebookMetadata } = useProviderContext();
  const cellsArray = doc.getArray('cells');
  const [cellDataArr, setCellDataArr] = useState(cellsArray.toArray());
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const cells = doc.getArray('cells');

    const observer = () => {
      setCellDataArr(cells.toArray());
    };

    cells.observe(observer);
  }, [docID]);

  useEffect(() => {
    if (!awareness) return;

    const color = randomColor();
    const name = generateRandomName();
    awareness.setLocalStateField('user', { name, color });

    const updateClients = () => {
      var jsonData = awareness.getStates();
      const clientObjects = getUserObjects(jsonData);
      setClients(clientObjects);
    };

    awareness.on('update', updateClients);

    return () => {
      awareness.off('update', updateClients);
    };
  }, [awareness]);

  const deleteCell = async id => {
    const cellIndex = cellsArray.toArray().findIndex(c => c.get('id') === id);
    if (cellIndex !== -1) cellsArray.delete(cellIndex);
  };

  const addCellAtIndex = async (idx, type) => {
    const cell = createCell(type);
    if (idx >= cellsArray.length) {
      cellsArray.push([cell]);
    } else {
      cellsArray.insert(idx + 1, [cell]);
    }
  };

  const repositionCell = async (cell, newIndex) => {
    const clone = cell.clone();
    cell.set('id', 'delete');
    await deleteCell('delete');
    cellsArray.insert(newIndex, [clone]);
  };

  const handleTitleChange = newTitle => {
    notebookMetadata.set('title', newTitle);
    setTitle(newTitle);
  };

  useEffect(() => {
    const titleObserver = () => {
      const docTitle = notebookMetadata.get('title');
      setTitle(docTitle.toString() || 'untitled');
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
    handleTitleChange
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Navbar codeCells={codeCellsForDredd} clients={clients} provider={provider} setClients={setClients} />
      <Box className='notebook-column'>
        <Cells cells={cellDataArr} setCells={setCellDataArr} />
      </Box>
    </NotebookContext.Provider>
  );
};

export default Notebook;
