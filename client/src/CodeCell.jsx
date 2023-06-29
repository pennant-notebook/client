import { useContext, useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { MonacoBinding } from 'y-monaco';
import { checkStatus, sendToJudge, parseEngineResponse } from './services/codeExecutionService';
import AddCell from './AddCell';
import CodeToolbar from './CodeToolbar';
import * as Y from 'yjs';
import NotebookContext from './NotebookContext';

const CodeCell = ({ id, index, cell }) => {
  const { awareness, ydoc, addCellAtIndex, deleteCell, handleEditingChange } = useContext(NotebookContext);
  const editorRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState('');
  const [hoverBottom, setHoverBottom] = useState(false);
  const [outputMap, setOutputMap] = useState(null);

  useEffect(() => {
    if (!editorRef.current) {
      const type = ydoc.getText(id);
      const undoManager = new Y.UndoManager(type);
      setOutputMap(ydoc.getMap(`${id}-output`));

      const editor = monaco.editor.create(editorRef.current, {
        value: type.toString(),
        language: 'javascript'
      });

      new MonacoBinding(type, editor.getModel(), new Set([editor]), awareness);
      editor.onDidChangeModelContent(e => {
        handleEditingChange(id, editor.getValue().trim());
      });
    }
  }, [id, ydoc, awareness, handleEditingChange]);

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
        ref={editorRef}
        style={{
          width: '82%',
          margin: '0 auto',
          border: '1px solid dimgray',
          paddingBottom: output ? '4px' : '0',
          backgroundColor: 'navajowhite'
        }}>
        <CodeToolbar onClickRun={handleRunCode} id={id} onDelete={deleteCell} />
        <Typography sx={{ fontFamily: 'monospace', ml: '5px', backgroundColor: 'charcoal' }}>
          {processing ? 'Processing...' : output}
        </Typography>
      </Box>
      <AddCell addCell={addCellAtIndex} index={index} hover={hoverBottom} setHover={setHoverBottom} />
    </Stack>
  );
};

export default CodeCell;
