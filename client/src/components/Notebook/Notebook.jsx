import { useEffect, useState } from 'react';
import { Box } from '../../utils/MuiImports';
import Cells from '../Cells/Cells';
import Navbar from './Navbar';
import Clients from '../UI/Awareness/Clients';
import { NotebookContext } from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { createCell } from '../../utils/notebookHelpers';
import { generateRandomName, getUserObjects, randomColor } from '../../utils/awarenessHelpers';
import DreddBar from './DreddBar';

const Notebook = ({ docID }) => {
  const { doc, awareness } = useProviderContext();
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
      var jsonData = Array.from(awareness.getStates());
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

  const codeCellsForDredd = cellDataArr.filter(c => c.get('type') === 'code');

  const contextValue = {
    addCellAtIndex,
    repositionCell,
    deleteCell
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Navbar codeCells={codeCellsForDredd} />
      <Box className='notebook-row'>
        {docID && <DreddBar codeCells={codeCellsForDredd} />}
        <Box className='notebook-column'>
          <Cells cells={cellDataArr} setCells={setCellDataArr} />
        </Box>
        <Box className='client-avatars' sx={{ zIndex: 10, minWidth: '140px' }}>
          {clients.length > 1 && <Clients clients={clients} />}
        </Box>
      </Box>
    </NotebookContext.Provider>
  );
};

export default Notebook;
