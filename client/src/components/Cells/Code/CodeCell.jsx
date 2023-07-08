import { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography, Grid } from '@mui/material';

import { yPrettyPrint } from '../../../utils/yPrettyPrint';
import * as Y from 'yjs';

import useNotebookContext from '../../../contexts/NotebookContext';
import useProviderContext from '../../../contexts/ProviderContext';

import { MonacoBinding } from 'y-monaco';
import { Editor } from '@monaco-editor/react';
import CodeToolbar from './CodeToolbar';

import { sendToDredd, checkDreddStatus } from '../../../services/dreddExecutionService';

const CodeCell = ({ cellID, roomID, cell, content}) => {
  const { deleteCell } = useNotebookContext();
  const {awareness, notebookMetadata} = useProviderContext();

  const editorRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState('5vh');

  const outputMap = cell.get('outputMap');
  const [output, setOutput] = useState(outputMap.get('data'));

  const cellMetaData = cell.get('metaData');
  const [cellExeCount, setCellExeCount] = useState(cellMetaData.get('exeCount'));

  const [processing, setProcessing] = useState(false);

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

      // this is getting called twice for some reason
      outputMap.observe(() => {
        const data = cell.get('outputMap').get('data');
        // console.log({ data });
        setOutput(data);
      });

      cellMetaData.observe((e) => {
        console.log('output map event detected')
        console.log(e)
        e.changes.keys.forEach((change, key) => {
          console.log('key that changed => ', key)
          if (key === 'exeCount') {
            console.log('exeCount change detected by key observer')
            setCellExeCount(cellMetaData.get('exeCount'));
          }
      })})
    
  }, []);

  const parseDreddResponse = response => {
    // console.log(response);
    return response[0].output;
  };

  const handleOnClickRun = async () => {
    const numNotebookExecutions = notebookMetadata.get('executionCount');

    cellMetaData.set('exeCount', numNotebookExecutions + 1);
    // setCellExeCount((prevCount) => prevCount + 1);
    notebookMetadata.set('executionCount', numNotebookExecutions + 1);


    yPrettyPrint(cell);
    handleDredd();
  }
  const handleDredd = async () => {
    setProcessing(true); // for Toast
    const token = await sendToDredd(roomID, cellID, editorRef.current.getValue()); // 2nd arg is input
    const response = await checkDreddStatus(token);
    const processedResponse = parseDreddResponse(response);
    // console.log({ processedResponse });
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
        [{cellExeCount ? cellExeCount : '*'}]
      </Grid>
      <Grid item xs={11}>
        <Stack sx={{ width: '100%' }}>
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
              <CodeToolbar onClickRun={handleOnClickRun} id={cellID} onDelete={deleteCell} />
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
          </Box>
        </Stack>
      </Grid>
    </Grid>
    </Box>
  );
};

export default CodeCell;
