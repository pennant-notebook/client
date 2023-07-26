import { Box, Stack, Typography, useTheme } from '../../utils/MuiImports';
import { useEffect, useRef, useState, useCallback } from 'react';
import useProviderContext from '../../contexts/ProviderContext';
import useNotebookContext from '../../contexts/NotebookContext';
import CodeToolbar from './CodeToolbar';
import createCodeEditor, { updateLineNumbers } from './createCodeEditor';
import { handleDredd, updateMetadata } from '../../services/dreddExecutionService';
import StyledBadge from '../UI/StyledComponents';
import { useCMThemeContext } from '../../contexts/ThemeManager';

const CodeCell = ({ cellId, cell, content, getStartingLineNumber }) => {
  const { editorTheme } = useCMThemeContext();

  const { awareness, notebookMetadata, docID } = useProviderContext();
  const { deleteCell, allRunning } = useNotebookContext();

  const cellMetadata = cell.get('metaData');
  const outputMap = cell.get('outputMap');

  const [cellExeCount, setCellExeCount] = useState(cellMetadata.get('exeCount'));
  const [output, setOutput] = useState(outputMap.get('stdout'));
  const [status, setStatus] = useState(outputMap.get('status'));

  const [processing, setProcessing] = useState(false);
  const editorRef = useRef(null);

  const handleRunCode = useCallback(async () => {
    try {
      setProcessing(true);
      const response = await handleDredd(docID, cellId, cell.get('content').toString());
      const outputMap = cell.get('outputMap');
      outputMap.set('stdout', response.output);
      outputMap.set('status', response.type);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
    updateMetadata(cellMetadata, notebookMetadata);
  }, [docID, cellId, cell]);

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
        }
      });
    });
  }, [outputMap, cellMetadata]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}>
      <Stack direction='row' sx={{ width: '100%', alignItems: 'center' }}>
        <StyledBadge badgeContent={processing || allRunning ? '*' : cellExeCount || ' '} status={status} />
        <Box className='codecell-container'>
          <CodeToolbar
            onClickRun={handleRunCode}
            id={cellId}
            onDelete={deleteCell}
            processing={processing}
            allRunning={allRunning}
          />
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
