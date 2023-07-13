import { Box, Stack, Typography } from '../../MuiImports';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MonacoBinding } from 'y-monaco';
import CodeToolbar from './CodeToolbar';
import { Editor } from '@monaco-editor/react';
import useNotebookContext from '../../../contexts/NotebookContext';
import useProviderContext from '../../../contexts/ProviderContext';
import { editorOptions, updateMetadata, updateEditorHeight } from '../../../utils/codeHelpers';
import { sendToDredd, checkDreddStatus } from '../../../services/dreddExecutionService';
import './CodeCell.css';

const CodeCell = ({ cellID, roomID, cell, content }) => {
  const { deleteCell } = useNotebookContext();
  const { awareness, notebookMetadata } = useProviderContext();
  const cellMetadata = cell.get('metaData');
  const outputMap = cell.get('outputMap');

  const [cellExeCount, setCellExeCount] = useState(cellMetadata.get('exeCount'));
  const [output, setOutput] = useState(outputMap.get('stdout'));
  const [processing, setProcessing] = useState(false);
  const [editorHeight, setEditorHeight] = useState('auto');
  const editorRef = useRef(null);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    new MonacoBinding(content, editor.getModel(), new Set([editor]), awareness);
    updateEditorHeight(editor, setEditorHeight);
  }, []);

  const handleDredd = async () => {
    try {
      updateMetadata(cellMetadata, notebookMetadata);
      const token = await sendToDredd(roomID, cellID, editorRef.current.getValue());
      const response = await checkDreddStatus(token);
      const processedResponse = response[0].output;
      outputMap.set('stdout', processedResponse);
    } catch (error) {
      if (error.message === "Request failed with status code 500") {
        outputMap.set('stdout', 'A server error occurred, please try again');
      } else if (error.message === 'critical error'){
        outputMap.set('stdout', error.message + " code has timed out");
      } else {
        outputMap.set('stdout', 'An error occurred');
      }
    }
  };

  const handleRunCode = () => {
    setProcessing(true);
    handleDredd();
    setProcessing(false);
  };

  useEffect(() => {
    if (outputMap) {
      outputMap.observe(() => {
        setOutput(outputMap.get('stdout'));
      });
    }

    cellMetadata.observe(e => {
      console.log('output map event detected');
      console.log(e);
      e.changes.keys.forEach((change, key) => {
        console.log('key that changed => ', key);
        if (key === 'exeCount') {
          console.log('exeCount change detected by key observer');
          setCellExeCount(cellMetadata.get('exeCount'));
        }
      });
    });
  }, [outputMap, cellMetadata]);

  return (
    <Box sx={{ position: 'relative', display: 'flex', margin: '0 auto', width: '100%' }}>
      <Box
        sx={{
          position: 'absolute',
          left: { xs: '3vw', sm: '4vw', lg: '5vw' },
          top: '50%',
          transform: 'translateY(-50%)'
        }}>
        <Typography className='exeCount'>{cellExeCount ? cellExeCount : '*'}</Typography>
      </Box>
      <Stack direction='row' sx={{ width: '82%', alignItems: 'center', margin: '0 auto', pl: { sm: '2%', lg: '1%' } }}>
        <Box className='codecell-container'>
          <CodeToolbar onClickRun={handleRunCode} id={cellID} onDelete={deleteCell} />
          <Editor
            aria-labelledby='Code Editor'
            height={editorHeight}
            defaultLanguage='javascript'
            theme='vs-dark'
            onMount={handleEditorDidMount}
            options={editorOptions}
          />
          <Typography sx={{ fontFamily: 'monospace', ml: '5px', backgroundColor: 'charcoal' }}>
            {processing ? 'Processing...' : output}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default CodeCell;
