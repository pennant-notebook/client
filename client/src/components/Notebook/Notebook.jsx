import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';

import { createCell, initializeProvider } from '../../utils/notebookHelpers';
import { yPrettyPrint } from '../../utils/yPrettyPrint';

import Header from './Header';
import MarkdownCell from '../Cells/Markdown/MarkdownCell';
import CodeCell from '../Cells/Code/CodeCell';
import AddCell from '../Cells/AddCell';

import { NotebookContext } from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import Cells from '../Cells/Cells';

const roomToProviderMap = new Map();
const roomToDocMap = new Map();

const Notebook = ({ roomID }) => {
  const {doc, provider, awareness, cellsArray, notebookMetadata} = useProviderContext();

  const [cellsYArray, setCellsYArray] = useState(cellsArray.toArray());

  useEffect(() => {
    roomToProviderMap.set(roomID, provider);
    
    const observer = () => {
      yPrettyPrint(doc)
      setCellsYArray(cellsArray.toArray());
    };

    cellsArray.observe(observer);
  }, [roomID]);

  const deleteCell = id => {
    const cellArray = doc.getArray('cells');
    const cellIndex = cellArray.toArray().findIndex(c => c.get('id') === id);
    if (cellIndex !== -1) cellArray.delete(cellIndex);
  };

  const addCellAtIndex = (idx, type) => {
    const cellArray = doc.getArray('cells');
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
    notebookMetadata,
    addCellAtIndex,
    repositionCell,
    deleteCell,
    awareness,
    doc,
    provider
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Header roomID={roomID} codeCells={codeCellsForDredd} />
      <Cells roomID={roomID} cells={cellDataArr} setCells={setCellDataArr} />
    </NotebookContext.Provider>
  );
};

export default Notebook;
