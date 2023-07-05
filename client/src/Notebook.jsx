import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { createCell, initializeProvider } from './notebookHelpers';
import MarkdownCell from './MarkdownCell';
import CodeCell from './CodeCell';
import AddCell from './AddCell';
import { NotebookContext } from './NotebookContext';

const roomToProviderMap = new Map();
const roomToDocMap = new Map();

const Notebook = ({ roomID }) => {
  const provider = useRef(roomToProviderMap.get(roomID));
  const doc = useRef(roomToDocMap.get(roomID));
  const awareness = useRef(provider.current ? provider.current.awareness : null);
  const [cellsYArray, setCellsYArray] = useState([]);

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
        setCellsYArray(cells.toArray());
      };

      cells.observe(observer);
    }
  }, [roomID]);

  const deleteCell = id => {
    const cellArray = doc.current.getArray('cells');
    const cellIndex = cellArray.toArray().findIndex(c => c.get('id') === id);
    if (cellIndex !== -1) cellArray.delete(cellIndex);
  };

  const addCellAtIndex = (idx, type) => {
    const cellArray = doc.current.getArray('cells');
    const cell = createCell(type);
    console.log('cell from within addCellAtIndex', cell)
    if (idx >= cellArray.length) {
      cellArray.push([cell]);
    } else {
      cellArray.insert(idx + 1, [cell]);
    }
  };

  const contextValue = {
    addCellAtIndex,
    deleteCell,
    awareness: awareness.current,
    doc: doc.current,
    provider: provider.current
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Box sx={{ mx: 5, py: 1 }}>
        {cellsYArray &&
          cellsYArray.map((cell, index) => {
            const id = cell.get('id');
            const type = cell.get('type');
            const text = cell.get('editorContent');
            return (
              <Box key={id || index}>
                {type === 'markdown' && (
                  <Box>
                    <MarkdownCell id={id} ytext={text} />
                    <AddCell index={index} />
                  </Box>
                )}
                {type === 'code' && (
                  <Box>
                    <CodeCell id={id} cell={cell} ytext={text} />
                    <AddCell index={index} />
                  </Box>
                )}
              </Box>
            );
          })}
      </Box>
      {cellsYArray && cellsYArray.length === 0 && <AddCell index={0} />}
      {/* {cellDataArr && cellDataArr.length === 0 && <AddCell index={0} />} */}
    </NotebookContext.Provider>
  );
};

export default Notebook;

