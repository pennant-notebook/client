import { Box, Stack, Typography } from '../../utils/MuiImports';
import { useEffect, useRef, useState } from 'react';
import useProviderContext from '../../contexts/ProviderContext';
import useNotebookContext from '../../contexts/NotebookContext';
import CodeToolbar from './CodeToolbar';
import createCodeEditor from './createCodeEditor';
import { handleDredd, updateMetadata } from '../../utils/codeHelpers';

const CodeCell = ({ cellId, cell, content }) => {
  const { awareness, notebookMetadata, docID } = useProviderContext();
  const { deleteCell } = useNotebookContext();
  const cellMetadata = cell.get('metaData');
  const outputMap = cell.get('outputMap');

  const [cellExeCount, setCellExeCount] = useState(cellMetadata.get('exeCount'));
  const [output, setOutput] = useState(outputMap.get('stdout'.split('\n')));
  const [processing, setProcessing] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const editorContainer = document.querySelector(`#editor-${cellId}`);
    if (editorContainer && editorContainer.firstChild) {
      editorContainer.removeChild(editorContainer.firstChild);
    }

    editorRef.current = createCodeEditor(content, awareness, cellId, handleRunCode);
    editorContainer.appendChild(editorRef.current.dom);
  }, [content]);

  useEffect(() => {
    if (outputMap) {
      outputMap.observe(() => {
        setOutput(outputMap.get('stdout'));
      });
    }

    cellMetadata.observe(e => {
      e.changes.keys.forEach((change, key) => {
        if (key === 'exeCount') {
          setCellExeCount(cellMetadata.get('exeCount'));
        } else if (key === 'isRunning') {
          setProcessing(cellMetadata.get('isRunning'));
        }
      });
    });
  }, [outputMap, cellMetadata]);

  const handleRunCode = async () => {
    setProcessing(true);
    cellMetadata.set('isRunning', true);
    updateMetadata(cellMetadata, notebookMetadata);
    let response;
    try {
      response = await handleDredd(docID, cellId, cell.get('content').toString());
    } catch (error) {
      console.log(error);
    }
    outputMap.set('stdout', response);
    cellMetadata.set('isRunning', false);
    setProcessing(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}>
      <Stack direction='row' sx={{ width: '100%', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.8rem', flexShrink: 0, mr: 2, textAlign: 'center' }} className='exeCount'>
          {cellExeCount || '*'}
        </Typography>
        <Box className='codecell-container'>
          <CodeToolbar onClickRun={handleRunCode} id={cellId} onDelete={deleteCell} processing={processing} />
          <Box id={`editor-${cellId}`}></Box>
          <Box className='codecell-output' sx={{ py: output ? '4px' : 0 }}>
            {processing ? (
              <Typography sx={{ ml: '5px', color: '#cfd1d8' }}>Processing...</Typography>
            ) : (
              output &&
              output.split('\n').map((stdout, idx) => (
                <Typography key={idx} sx={{ ml: '5px', color: '#cfd1d8' }}>
                  {stdout}
                </Typography>
              ))
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default CodeCell;
