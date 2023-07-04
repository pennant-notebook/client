// Notebook.jsx
import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { createCell, initializeProvider, initializeYDoc } from './notebookHelpers';
import MarkdownCell from './MarkdownCell';
import CodeCell from './CodeCell';
import AddCell from './AddCell';
import { NotebookContext } from './NotebookContext';

const roomToProviderMap = new Map();
const roomToYDocMap = new Map();


const Notebook = ({ roomID }) => {

  // const [cellDataArr, setCellDataArr] = useState(doc.getArray('cells').toArray());
  // const cellDataArrRef = useRef(doc.getArray('cells'));
  // const editorRef = useRef(null);


  // useEffect(() => {
  //   provider.on('sync', isSynced => {
  //     console.log('\n\nlocal yDoc has synced')
  //     yPrettyPrint(doc)

  //     const _cda = doc.get('cells')
  //     setCellDataArr(_cda.toArray())

  //     _cda.observe(e => {
  //       setCellDataArr(_cda.toArray())
  //     })
  //   })
  // }, [])
  const ydocRef = useRef(roomToYDocMap.get(roomID));
  const providerRef = useRef(roomToProviderMap.get(roomID));
  const awarenessRef = useRef(null);
  const [cells, setCells] = useState([]);
  const [_, forceRefresh] = useState([]);

  useEffect(() => {
    console.log(roomID)
    console.log(ydocRef.current)
    if (!ydocRef.current) {
      ydocRef.current = initializeYDoc(roomID);
      roomToYDocMap.set(roomID, ydocRef.current);
      const cells = ydocRef.current.getArray('cells');
      cells.observe(() => {
        setCells(ydocRef.current.getArray('cells'));
        forceRefresh([]);
      });
      setCells(cells);
    }

    if (!providerRef.current) {
      providerRef.current = initializeProvider(ydocRef.current, roomID);
      roomToProviderMap.set(roomID, providerRef.current);
      awarenessRef.current = providerRef.current.awareness;
    }
  }, [roomID]);

  const deleteCell = id => {
    const cellArray = ydocRef.current.getArray('cells');
    const cellIndex = cellArray.toArray().findIndex(c => c.get('id') === id);
    if (cellIndex !== -1) cellArray.delete(cellIndex);
  };

  const addCellAtIndex = (idx, type) => {
    const cellArray = ydocRef.current.getArray('cells');
    const cell = createCell(type);
    if (idx >= cellArray.length) {
      cellArray.push([cell]);
    } else {
      cellArray.insert(idx + 1, [cell]);
    }
  };

  const contextValue = {
    addCellAtIndex,
    deleteCell,
    awareness: awarenessRef.current,
    ydoc: ydocRef.current,
    provider: providerRef.current
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Box sx={{ mx: 5, py: 1 }}>
        {cells &&
          cells.map((cell, index) => {
            const id = cell.get('id');
            const type = cell.get('type');
            const text = cell.get('text');
            return (
              <Box key={id || index}>
                {type === 'markdown' && <MarkdownCell id={id} index={index} ytext={text} />}
                {type === 'code' && <CodeCell id={id} index={index} cell={cell} ytext={text} />}
              </Box>
            );
          })}
      </Box>
      {cells && cells.length === 0 && <AddCell index={0} />}
    </NotebookContext.Provider>
  );
};

export default Notebook;
