import { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { MonacoBinding } from 'y-monaco';
import { checkStatus, sendToJudge, parseEngineResponse } from './services/codeExecutionService';
import CodeToolbar from './CodeToolbar';
import { Editor } from '@monaco-editor/react';
import useNotebookContext from './NotebookContext';
import AddCell from './AddCell';

const CodeCell = ({ id, cell, ytext }) => {
  const { awareness, deleteCell } = useNotebookContext();
  const editorRef = useRef(null);
  const outputMap = cell.get('outputMap');
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState('');
  // const [editorHeight, setEditorHeight] = useState('5vh');

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    new MonacoBinding(ytext, editor.getModel(), new Set([editor]), awareness);
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = editor.getModel().getLineCount();
    setEditorHeight(`${lineCount * lineHeight}px`);
  };

  useEffect(() => {
    if (outputMap) {
      outputMap.observe(() => {
        const data = outputMap.get('data');
        setOutput(data);
      });
    }
  }, [outputMap]);

  const handleRunCode = async () => {
    setProcessing(true);
    const response = await sendToJudge(editorRef.current.getValue(), '', 63);
    const processedResponse = await checkStatus(response.data.token);
    setProcessing(false);
    const convertedOutput = parseEngineResponse(processedResponse);
    outputMap.set('data', convertedOutput);
  };

  return (
    <Stack>
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
        <CodeToolbar onClickRun={handleRunCode} id={id} onDelete={deleteCell} />
        <Editor
          aria-labelledby='Code Editor'
          className='justify-center'
          height='25vh'
          defaultLanguage='javascript'
          theme='vs-dark'
          onMount={handleEditorDidMount}
          options={{
            cursorBlinking: 'smooth',
            minimap: { enabled: false },
            scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
            scrollBeyondLastLine: false,
            lineHeight: 22
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
