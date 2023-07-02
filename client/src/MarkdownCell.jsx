import { useContext, useEffect, useState, useRef } from 'react';
import { Box, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import AddCell from './AddCell';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneDark, duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CloseSharp } from '@mui/icons-material';
import NotebookContext from './NotebookContext';

const MarkdownCell = ({ index, id, ytext }) => {
  const { deleteCell, editing, handleDoubleClick, handleBlur, handleEditingChange } = useContext(NotebookContext);
  const [hover, setHover] = useState(false);
  const [hoverBottom, setHoverBottom] = useState(false);
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
        onBlur={handleBlur}>
        <Box sx={{ position: 'absolute', top: '0', right: '0' }}>
          <Tooltip title='Remove cell'>
            <IconButton
              onMouseOver={() => setHover(true)}
              onMouseOut={() => setHover(false)}
              onClick={() => deleteCell(id)}
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
              <CloseSharp sx={{ color: 'dimgray', opacity: hover ? 1 : 0.5 }} />
            </IconButton>
          </Tooltip>
        </Box>
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
          <Box sx={{ width: '100%', height: '100%' }} className='markdown'>
            <ReactMarkdown
              className='prose'
              components={{
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
