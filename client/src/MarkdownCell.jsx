import { useContext, useEffect, useState, useRef } from 'react';
import { Box, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import AddCell from './AddCell';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneDark, duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CloseSharp } from '@mui/icons-material';

import NotebookContext from './NotebookContext';
// import { useNotebookContext } from './NotebookContext';
// import { deleteCell, handleEditingChange } from './notebookHelpers';

const MarkdownCell = ({ index, id, ytext }) => {
  const { addCellAtIndex, deleteCell, editing, handleDoubleClick, handleBlur, handleEditingChange, ydoc } =
    useContext(NotebookContext);
  const [hoverBottom, setHoverBottom] = useState(false);
  const [hover, setHover] = useState(false);
  const textareaRef = useRef();
  const [text, setText] = useState('');

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
      <Paper
        variant={editing === index ? 'outlined' : 'elevation'}
        sx={{
          paddingX: 2,
          paddingY: 2,
          width: '80%',
          margin: '0 auto',
          height: '100%',
          position: 'relative'
        }}
        onDoubleClick={() => handleDoubleClick(index)}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        onBlur={handleBlur}>
        {(editing === index || hover) && (
          <Box sx={{ position: 'absolute', top: '0', right: '0' }}>
            <Tooltip title='Remove cell'>
              <IconButton
                onMouseOver={() => setHover(true)}
                onClick={() => deleteCell(id)}
                sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                <CloseSharp sx={{ color: 'dimgray' }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        {editing === index ? (
          <TextareaAutosize
            ref={textareaRef}
            defaultValue={text}
            onChange={handleTextareaChange}
            onBlur={handleTextareaBlur}
            onDoubleClick={() => handleDoubleClick(index)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              resize: 'none'
            }}
            placeholder='Double-click here to start editing...'
            autoFocus
          />
        ) : text.trim() !== '' ? (
          <Box sx={{ width: '100%', height: '100%' }}>
            <ReactMarkdown
              components={{
                p: props => <p {...props} style={{ margin: 0, padding: 0, color: 'charcoal' }} />,
                h1: props => <h1 {...props} style={{ margin: 0, padding: 0, color: 'rebeccapurple' }} />,
                h2: props => <h2 {...props} style={{ margin: 0, padding: 0, color: 'green' }} />,
                h3: props => <h3 {...props} style={{ margin: 0, padding: 0, color: 'coral' }} />,
                h4: props => <h4 {...props} style={{ margin: 0, padding: 0, color: 'maroon' }} />,
                h5: props => <h5 {...props} style={{ margin: 0, padding: 0, color: 'dodgerblue' }} />,
                h6: props => <h6 {...props} style={{ margin: 0, padding: 0, color: '#DA70D6' }} />,
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={match[1] === 'js' ? duotoneDark : duotoneSpace}
                      language={match[1]}
                      PreTag='div'
                      children={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}>
              {text}
            </ReactMarkdown>
          </Box>
        ) : (
          <p>Double-click here to start editing...</p>
        )}
      </Paper>

      <AddCell index={index} hover={hoverBottom} setHover={setHoverBottom} />
    </Stack>
  );
};

export default MarkdownCell;
