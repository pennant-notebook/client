import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { createCell, initializeProvider } from '../../utils/notebookHelpers';
import MarkdownCell from '../Cells/Markdown/MarkdownCell';
import CodeCell from '../Cells/Code/CodeCell';
import AddCell from '../Cells/AddCell';
import { NotebookContext } from '../../contexts/NotebookContext';
import Header from './Header';
import { yPrettyPrint } from '../../utils/yPrettyPrint';

const roomToProviderMap = new Map();
const roomToDocMap = new Map();

const Notebook = ({ roomID }) => {
  const provider = useRef(roomToProviderMap.get(roomID));
  const doc = useRef(roomToDocMap.get(roomID));
  const awareness = useRef(provider.current ? provider.current.awareness : null);
  const [cellsYArray, setCellsYArray] = useState([]);

  const notebookMetadataRef = useRef(null)

  const exeCountNotebookRef = useRef(0)
  // yPrettyPrint(doc.current)

  useEffect(() => {
    if (!provider.current) {
      const hocusPocus = initializeProvider(roomID);
      const _document = hocusPocus.document;

      doc.current = _document;
      provider.current = hocusPocus;
      awareness.current = provider.current.awareness;
      roomToProviderMap.set(roomID, provider.current);
      
      const cells = _document.getArray('cells');
      const metaData = _document.getMap('metaData');

      notebookMetadataRef.current = metaData

      if (!metaData.get('exeCount')) {
        metaData.set('exeCount', 0)
      }

      exeCountNotebookRef.current = metaData.get('exeCount')

      // event driven features based on current metadata
      metaData.observe(event => {
        // look for changes in total notebook execution count and update the exeCountNotebookRef
        if (event.keysChanged.has('exeCount')) {
          exeCountNotebookRef.current = metaData.get('exeCount')
        }
      })


      

      

      
      
      // if (doc.current && !metaData.get('exeCount')) {
      //   metaData.set('exeCount', 0);
      // }

      const observer = () => {
        yPrettyPrint(hocusPocus.document)
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
    console.log('cell from within addCellAtIndex', cell);
    if (idx >= cellArray.length) {
      cellArray.push([cell]);
    } else {
      cellArray.insert(idx + 1, [cell]);
    }
  };

  const contextValue = {
    notebookMetadataRef: notebookMetadataRef,
    exeCountNotebookRef: exeCountNotebookRef,
    addCellAtIndex,
    deleteCell,
    awareness: awareness.current,
    doc: doc.current,
    provider: provider.current
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
