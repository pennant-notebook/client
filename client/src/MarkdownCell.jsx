import { useContext, useEffect, useState, useRef } from 'react';
import { Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import AddCell from './AddCell';

import { Editor } from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import MarkdownToolbar from './MarkdownToolbar';


import NotebookContext from './NotebookContext';



const MarkdownCell = ({ index, id, ytext, cell }) => {
  const [hoverBottom, setHoverBottom] = useState(false);
  const [hover, setHover] = useState(false);
  const textareaRef = useRef();
  const [text, setText] = useState('');

  const [output, setOutput] = useState('');
  const [outputMap, setOutputMap] = useState(null);
  const editorRef2 = useRef(null);
  const [processing, setProcessing] = useState(false);
  const { awareness, ydoc, deleteCell, handleEditingChange } = useContext(NotebookContext);

  const handleEditorDidMount = (editor, monaco) => {

    const undoManager = new Y.UndoManager(ytext);

    new MonacoBinding(ytext, editor.getModel(), new Set([editor]), awareness);

    editor.onDidChangeModelContent(e => {
      handleEditingChange(ydoc, id, editor.getValue().trim());
    });
  };

  useEffect(() => {
    setOutputMap(ydoc.getMap('output'));
  }, [cell]);

  useEffect(() => {
    if (outputMap) {
      outputMap.observe(() => {
        const data = outputMap.get('data');
        setOutput(data);
      });
    }
  }, [outputMap]);
  ////

  useEffect(() => {
    const type = ytext;
    setText(type.toString());

    const updateText = () => {
      setText(type.toString());
    };

    type.observe(() => {
      updateText();
    });
  }, [ytext]);

  const handleTextareaChange = e => {
    ytext.doc.transact(() => {
      ytext.delete(0, ytext.length);
      ytext.insert(0, e.target.value);
    }, textareaRef.current);
  };

  const handleTextareaBlur = () => {
    handleEditingChange(id, text);
  };

  return (
<Stack>

      <Box
        ref={editorRef2}
        style={{
          width: '82%',
          margin: '0 auto',
          border: '10px solid pink',
          paddingBottom: output ? '4px' : '0',
          backgroundColor: 'red',
          color: 'red',
        }}>
        <MarkdownToolbar id={id} onDelete={deleteCell} />
        <Editor
          aria-labelledby='Code Editor'
          className={'justify-center'}
          defaultLanguage='markdown'
          height='20vh'
          theme='vs-dark'
          onMount={handleEditorDidMount}
          options={{
            cursorBlinking: 'smooth'
          }}
        />
        <Typography sx={{ fontFamily: 'monospace', ml: '5px', backgroundColor: 'charcoal' }}>
          {processing ? 'Processing...' : output}
        </Typography>
      </Box>
      <AddCell index={index} hover={hoverBottom} setHover={setHoverBottom} />
      
    </Stack>
  );
};

export default MarkdownCell;
