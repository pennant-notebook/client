import { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography, Grid } from '@mui/material';
import { MonacoBinding } from 'y-monaco';
import { checkStatus, sendToJudge, parseEngineResponse } from '../../../services/codeExecutionService';
import CodeToolbar from './CodeToolbar';
import { Editor } from '@monaco-editor/react';
import useNotebookContext from './contexts/NotebookContext';
import { sendToDredd, checkDreddStatus } from '../../../services/dreddExecutionService';
import { yPrettyPrint } from '../../../utils/yPrettyPrint';

const CodeCell = ({ cellID, roomID, cell, ytext }) => {
  yPrettyPrint(cell);
  const { awareness, deleteCell } = useNotebookContext();
  const editorRef = useRef(null);
  const outputMap = cell.get('outputMap');
  const outputData = outputMap.get('data');
  console.log({ outputData });
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState(outputMap.get('data'));
  console.log('output is: ', output);
  const [editorHeight, setEditorHeight] = useState('5vh');

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    new MonacoBinding(ytext, editor.getModel(), new Set([editor]), awareness);
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
        const data = cell.get('outputMap').get('data');
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
    <Box
      style={{
      width: '80%',
      margin: '0 auto',
      borderRadius: '5px',
      paddingBottom: output ? '4px' : '0',
    }}>
    <Grid 
      container spacing={2}
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
    >
      <Grid 
        item xs={1}
      >
        [count]
      </Grid>
      <Grid item xs={10}>
        <Stack>
          <Box
            className='codecell-container'
            style={{
              width: '100%',
              margin: '0 auto',
              border: '1px solid dimgray',
              borderRadius: '5px',
              paddingBottom: output ? '4px' : '0',
              backgroundColor: 'navajowhite'
            }}>
            <Box>
              <CodeToolbar onClickRun={handleDredd} id={cellID} onDelete={deleteCell} />
              <Editor
                aria-labelledby='Code Editor'
                className='justify-center'
                height={editorHeight}
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
          </Box>
        </Stack>
      </Grid>
    </Grid>
    </Box>
  );
};

export default CodeCell;
