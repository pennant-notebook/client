import { useEffect, useState, useRef } from 'react';
import { createCell, initializeProvider } from '../../utils/notebookHelpers';
import { NotebookContext } from '../../contexts/NotebookContext';
import Header from './Header';
import Cells from '../Cells/Cells';

const roomToProviderMap = new Map();
const roomToDocMap = new Map();

const Notebook = ({ roomID }) => {
  const provider = useRef(roomToProviderMap.get(roomID));
  const doc = useRef(roomToDocMap.get(roomID));
  const awareness = useRef(provider.current ? provider.current.awareness : null);
  const [cellDataArr, setCellDataArr] = useState([]);

  useEffect(() => {
    if (!provider.current) {
      provider.current = initializeProvider(roomID);
      roomToProviderMap.set(roomID, provider.current);
      awareness.current = provider.current.awareness;

      if (!doc.current) {
        doc.current = provider.current.document;
      }

      const cells = doc.current.getArray('cells');

      const observer = () => {
        setCellDataArr(cells.toArray());
      };

      cells.observe(observer);
    }
  }, [roomID]);

  const deleteCell = async id => {
    const cellArray = doc.current.getArray('cells');
    const cellIndex = cellArray.toArray().findIndex(c => c.get('id') === id);
    if (cellIndex !== -1) cellArray.delete(cellIndex);
  };

  const addCellAtIndex = async (idx, type) => {
    const cellArray = doc.current.getArray('cells');
    const cell = createCell(type);
    if (idx >= cellArray.length) {
      cellArray.push([cell]);
    } else {
      cellArray.insert(idx + 1, [cell]);
    }
  };

  const repositionCell = async (cell, newIndex) => {
    const clone = cell.clone();
    cell.set('id', 'delete');
    await deleteCell('delete');
    const cellArray = doc.current.getArray('cells');
    cellArray.insert(newIndex, [clone]);
  };

  const codeCellsForDredd = cellDataArr
    .filter(c => c.get('type') === 'code')
    .map(c => ({
      id: c.get('id'),
      code: c.get('content').toString()
    }));

  const contextValue = {
    addCellAtIndex,
    repositionCell,
    deleteCell,
    awareness: awareness.current,
    doc: doc.current,
    provider: provider.current
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Header roomID={roomID} codeCells={codeCellsForDredd} />
      <Cells roomID={roomID} cells={cellDataArr} setCells={setCellDataArr} />
    </NotebookContext.Provider>
  );
};

export default Notebook;
