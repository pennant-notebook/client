import { useEffect, useRef, useState } from 'react';
import { Box } from '../../utils/MuiImports';
import Cells from '../Cells/Cells';
import Navbar from './Navbar';
import { NotebookContext } from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { createCell, getUserObjects, generateRandomName, randomColor } from '../../utils/notebookHelpers';

const Notebook = ({ docID }) => {
  const { doc, provider, awareness, notebookMetadata } = useProviderContext();
  const [title, setTitle] = useState(docID);

  const cellsArray = doc.getArray('cells');
  const [cellDataArr, setCellDataArr] = useState(cellsArray.toArray());
  const cellOrderRef = useRef(0);

  const [clients, setClients] = useState([]);
  const [hideClients, setHideClients] = useState(true);

  useEffect(() => {
    let cells;
    if (cellOrderRef.current > 0) {
      const newYArrayName = `cells${cellOrderRef.current}`;
      cells = doc.getArray(newYArrayName);
    } else {
      cells = doc.getArray('cells');
    }

    const observer = () => {
      setCellDataArr(cells.toArray());
    };

    cells.observe(observer);
  }, [docID, cellOrderRef.current]);

  useEffect(() => {
    if (!awareness) return;

    const color = randomColor();
    const name = generateRandomName();
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
    handleTitleChange,
    cellOrderRef
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Navbar
        codeCells={codeCellsForDredd}
        provider={provider}
        clients={clients}
        setClients={setClients}
        hideClients={hideClients}
      />
      <Cells cells={cellDataArr} setCells={setCellDataArr} />
    </NotebookContext.Provider>
  );
};

export default Notebook;
