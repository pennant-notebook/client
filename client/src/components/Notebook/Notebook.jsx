import { useEffect, useState } from 'react';
import { createCell } from '../../utils/notebookHelpers';
import { NotebookContext } from '../../contexts/NotebookContext';
import Cells from '../Cells/Cells';
import useProviderContext from '../../contexts/ProviderContext';
import Header from './Header';
import { Box } from '../MuiImports';

const Notebook = ({ roomID }) => {
  const { doc } = useProviderContext();
  const cellsArray = doc.getArray('cells');
  const [cellDataArr, setCellDataArr] = useState(cellsArray.toArray());

  useEffect(() => {
    const cells = doc.getArray('cells');

    const observer = () => {
      setCellDataArr(cells.toArray());
    };

    cells.observe(observer);
  }, [roomID]);

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          alignItems: 'center'
        }}>
        <Header roomID={roomID} codeCells={codeCellsForDredd} />
        <Cells roomID={roomID} cells={cellDataArr} setCells={setCellDataArr} />
      </Box>
    </NotebookContext.Provider>
  );
};

export default Notebook;
