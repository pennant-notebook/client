import { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography, Grid } from '@mui/material';
import { MonacoBinding } from 'y-monaco';
import CodeToolbar from './CodeToolbar';
import { Editor } from '@monaco-editor/react';
import useNotebookContext from '../../../contexts/NotebookContext';
import { sendToDredd, checkDreddStatus } from '../../../services/dreddExecutionService';
import * as Y from 'yjs';

const CodeCell = ({ cellID, roomID, cell, content }) => {
  const { awareness, deleteCell } = useNotebookContext();
  const outputMap = cell.get('outputMap') || cell.set('outputMap', new Y.Map());
  const editorRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState(outputMap.get('data'));
  const [editorHeight, setEditorHeight] = useState('5vh');

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    new MonacoBinding(content, editor.getModel(), new Set([editor]), awareness);
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = editor.getModel().getLineCount();
    setEditorHeight(`${lineCount * lineHeight}px`);

    editor.onDidChangeModelContent(e => {
      const lineCount = editor.getModel().getLineCount();
      setEditorHeight(`${lineCount * lineHeight}px`);
    });
  };

  useEffect(() => {
    if (outputMap) {
      outputMap.observe(() => {
        const data = outputMap.get('data');
        console.log({ data });

        setOutput(data);
      });
    }
  }, [outputMap]);

  const parseDreddResponse = response => {
    console.log(response);
    return response[0].output;
  };

  const handleDredd = async () => {
    setProcessing(true); // for Toast
    const token = await sendToDredd(roomID, cellID, editorRef.current.getValue()); // 2nd arg is input
    const response = await checkDreddStatus(token);
    const processedResponse = parseDreddResponse(response);
    console.log({ processedResponse });
    setProcessing(false); // for Toast
    outputMap.set('data', processedResponse);
  };

  return (
    <Stack sx={{ width: '100%' }}>
      <Box
        className='codecell-container'
        style={{
          width: '80%',
          margin: '0 auto',
          border: '1px solid dimgray',
          borderRadius: '5px',
          paddingBottom: output ? '4px' : '0',
          backgroundColor: 'navajowhite'
        }}>
        <CodeToolbar onClickRun={handleDredd} id={cellID} onDelete={deleteCell} />
        <Editor
          aria-labelledby='Code Editor'
          height={editorHeight}
          defaultLanguage='javascript'
          theme='vs-dark'
          onMount={handleEditorDidMount}
          options={{
            cursorBlinking: 'smooth',
            minimap: { enabled: false },
            scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
            scrollBeyondLastLine: false,
            lineHeight: 24,
            fontSize: 15,
            fontFamily: 'Fira Code'
          }}
        />

        <Typography sx={{ fontFamily: 'monospace', ml: '5px', backgroundColor: 'charcoal' }}>
          {processing ? 'Processing...' : output}
        </Typography>
      </Box>
    </Stack>
  );
};

export default CodeCell;
