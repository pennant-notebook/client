// Notebook.jsx
import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { createCell } from './notebookHelpers';
import MarkdownCell from './MarkdownCell';
import CodeCell from './CodeCell';
import AddCell from './AddCell';
import { NotebookContext } from './NotebookContext';
import { yPrettyPrint } from './utils/yPrettyPrint';

const roomToProviderMap = new Map();
const roomTodocMap = new Map();


const Notebook = ({ roomID, doc, provider }) => {
  const [cellDataArr, setCellDataArr] = useState(doc.getArray('cells').toArray());
  const cellDataArrRef = useRef(doc.getArray('cells'));
  const editorRef = useRef(null);

  let awareness = provider?.awareness;

  useEffect(() => {
    provider.on('sync', isSynced => {
      console.log('\n\nlocal doc has synced')
      yPrettyPrint(doc)

      const _cda = doc.get('cells')
      setCellDataArr(_cda.toArray())

      _cda.observe(e => {
        setCellDataArr(_cda.toArray())
      })
    })
  }, [])


  const deleteCell = id => {
    const cellArray = doc.getArray('cells');
    const cellIndex = cellArray.toArray().findIndex(c => c.get('id') === id);
    if (cellIndex !== -1) cellArray.delete(cellIndex);
  };

  const addCellAtIndex = (idx, type) => {
    const cellArray = doc.getArray('cells');
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
    awareness,
    doc,
    provider
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Box sx={{ mx: 5, py: 1 }}>
        {cellDataArr &&
          cellDataArr.map((cell, index) => {
            const id = cell.get('id');
            const type = cell.get('type');
            const text = cell.get('editorContent');
            return (
              <Box key={id || index}>
                {type === 'markdown' && (
                  <Box>
                    <MarkdownCell id={id} editorContent={text} />
                    <AddCell index={index} />
                  </Box>
                )}
                {type === 'code' && (
                  <Box>
                    <CodeCell id={id} cell={cell} editorContent={text} />
                    <AddCell index={index} />
                  </Box>
                )}
              </Box>
            );
          })}
      </Box>
      {cellDataArr && cellDataArr.length === 0 && <AddCell index={0} />}
    </NotebookContext.Provider>
  );
};

export default Notebook;

