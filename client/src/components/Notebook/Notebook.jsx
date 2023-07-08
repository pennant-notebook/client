import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { createCell, initializeProvider } from '../../utils/notebookHelpers';
import MarkdownCell from '../Cells/Markdown/MarkdownCell';
import CodeCell from '../Cells/Code/CodeCell';
import AddCell from '../Cells/AddCell';
import { NotebookContext } from '../../contexts/NotebookContext';
import Header from './Header';
import { yPrettyPrint } from '../../utils/yPrettyPrint';
import useProviderContext from '../../contexts/ProviderContext';

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
    console.log('cell from within addCellAtIndex', cell);
    if (idx >= cellArray.length) {
      cellArray.push([cell]);
    } else {
      cellArray.insert(idx + 1, [cell]);
    }
  };

  const contextValue = {
    notebookMetadata,
    addCellAtIndex,
    deleteCell,
    awareness,
    doc,
    provider
  };

  const codeCellsForDredd = cellsYArray
    .filter(c => c.get('type') === 'code')
    .map(c => ({
      id: c.get('id'),
      code: c.get('editorContent').toString()
    }));


  return (
    <NotebookContext.Provider value={contextValue}>
      <Header roomID={roomID} codeCells={codeCellsForDredd} />

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
                  <div>
                    <Box>
                      <CodeCell cellID={id} roomID={roomID} cell={cell} ytext={text} />
                      <AddCell index={index} />
                    </Box>
                  </div>
                )}
              </Box>
            );
          })}
      </Box>
      {cellsYArray && cellsYArray.length === 0 && <AddCell index={0} />}
    </NotebookContext.Provider>
  );
};

export default Notebook;
