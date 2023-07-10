import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { MonacoBinding } from 'y-monaco';
import CodeToolbar from './CodeToolbar';
import { Editor } from '@monaco-editor/react';
import useNotebookContext from '../../../contexts/NotebookContext';
import useProviderContext from '../../../contexts/ProviderContext';
import { editorOptions, updateMetadata, updateEditorHeight } from '../../../utils/codeHelpers';
import { sendToDredd, checkDreddStatus } from '../../../services/dreddExecutionService';

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

  const handleRunCode = () => {
    setProcessing(true);
    handleDredd();
    setProcessing(false);
  };

  const handleDredd = async () => {
    updateMetadata(cellMetadata, notebookMetadata);
    const token = await sendToDredd(roomID, cellID, editorRef.current.getValue());
    const response = await checkDreddStatus(token);
    const processedResponse = response[0].output;
    outputMap.set('stdout', processedResponse);
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
    <Stack direction='row' sx={{ width: '82%', alignItems: 'center', margin: '0 auto' }}>
      <Typography sx={{ mr: '18px' }}>[{cellExeCount ? cellExeCount : '*'}]</Typography>
      <Box
        id='monaco-container'
        className='codecell-container'
        style={{
          flexGrow: 1,
          width: '90%',
          border: '1px solid dimgray',
          borderRadius: '5px',
          paddingBottom: output ? '4px' : '0',
          backgroundColor: 'navajowhite'
        }}>
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
  );
};

export default CodeCell;
