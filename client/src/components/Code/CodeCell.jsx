import { Box, Stack, Typography } from '../../utils/MuiImports';
import { useEffect, useRef, useState, useCallback } from 'react';
import useProviderContext from '../../contexts/ProviderContext';
import useNotebookContext from '../../contexts/NotebookContext';
import CodeToolbar from './CodeToolbar';
import createCodeEditor, { updateLineNumbers } from './createCodeEditor';
import { handleDredd, updateMetadata } from '../../services/dreddExecutionService';
import StyledBadge from '../UI/StyledComponents';
import { useCMThemeContext } from '../../contexts/ThemeManager';

const CodeCell = ({ cellId, cell, content, getStartingLineNumber, reportRef = () => {} }) => {
  const { editorTheme } = useCMThemeContext();
  const { awareness, notebookMetadata, docID } = useProviderContext();
  const { deleteCell } = useNotebookContext();

  const cellMetadata = cell.get('metaData');
  const outputMap = cell.get('outputMap');
  const cellRunning = cellMetadata.get('isRunning');

  const [cellExeCount, setCellExeCount] = useState(cellMetadata.get('exeCount'));
  const [output, setOutput] = useState(outputMap.get('stdout'));
  const [status, setStatus] = useState(outputMap.get('status'));
  const [processing, setProcessing] = useState(cellRunning);
  const editorRef = useRef(null);
  const cellRef = useRef(null);

  const handleRunCode = useCallback(async () => {
    try {
      cellMetadata.set('isRunning', true);
      const response = await handleDredd(docID, cellId, cell.get('content').toString());
      const outputMap = cell.get('outputMap');
      outputMap.set('stdout', response.output);
      outputMap.set('status', response.type);
    } catch (error) {
      console.error(error);
    } finally {
      cellMetadata.set('isRunning', false);
    }

    updateMetadata(cellMetadata, notebookMetadata);
  }, [docID, cellId, cell, cellMetadata]);

  useEffect(() => {
    const editorContainer = document.querySelector(`#editor-${cellId}`);
    if (editorContainer && editorContainer.firstChild) {
      editorContainer.removeChild(editorContainer.firstChild);
    }
    const startingLineNumber = getStartingLineNumber(cell.get('pos'));
    editorRef.current = createCodeEditor(content, awareness, cellId, startingLineNumber, handleRunCode, editorTheme);
    editorContainer.appendChild(editorRef.current.dom);

    updateLineNumbers(editorRef.current, startingLineNumber);
  }, [content, editorTheme]);

  useEffect(() => {
    cell.get('outputMap').observe(() => {
      setOutput(outputMap.get('stdout'));
      setStatus(outputMap.get('status') || 'output');
    });

    cellMetadata.observe(e => {
      e.changes.keys.forEach((change, key) => {
        if (key === 'exeCount') {
          setCellExeCount(cellMetadata.get('exeCount') || '');
        } else if (key === 'isRunning') {
          setProcessing(cellMetadata.get('isRunning') || false);
        }
      });
    });
  }, [outputMap, cellMetadata, processing]);

  useEffect(() => {
    reportRef(cellRef);
  }, [reportRef]);

  return (
    <Box
      ref={cellRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}>
      <Stack direction='row' sx={{ width: '100%', alignItems: 'center' }}>
        <StyledBadge badgeContent={processing ? '*' : cellExeCount || ' '} status={status} />
        <Box className='codecell-container'>
          <CodeToolbar onClickRun={handleRunCode} id={cellId} onDelete={deleteCell} processing={processing} />
          <Box id={`editor-${cellId}`}></Box>
          <Box className={`codecell-output ${status === 'error' ? 'error' : ''}`} sx={{ py: output ? '4px' : 0 }}>
            {processing ? (
              <Typography sx={{ ml: '5px', color: '#cfd1d8' }}>Processing...</Typography>
            ) : (
              output &&
              output?.split('\n').map((stdout, idx) => (
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
