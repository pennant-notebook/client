import { useEffect, useState, useRef } from 'react';
import { Box, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneDark, duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import { CloseSharp } from '@mui/icons-material';
import useNotebookContext from './NotebookContext';

const MarkdownCell = ({ id, ytext }) => {
  const { deleteCell } = useNotebookContext();
  const textareaRef = useRef();
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);

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

  return (
    <Stack>
      <Paper
        variant='standard'
        sx={{
          paddingX: 2,
          paddingY: 2,
          width: '80%',
          margin: '0 auto',
          height: '100%',
          position: 'relative'
        }}>
        <Box sx={{ position: 'absolute', top: '0', right: '0' }}>
          <Tooltip title='Remove cell'>
            <IconButton
              onClick={() => deleteCell(id)}
              sx={{ opacity: 0.5, '&:hover': { backgroundColor: 'transparent', opacity: 1 } }}>
              <CloseSharp sx={{ opacity: 0.5, color: 'dimgray', '&:hover': { opacity: 1 } }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ width: '100%', height: '100%' }} className='markdown'>
          {editing ? (
            <TextareaAutosize
              ref={textareaRef}
              value={text}
              onChange={handleTextareaChange}
              onBlur={() => setEditing(false)}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                resize: 'none'
              }}
              autoFocus
            />
          ) : (
            <div onClick={() => setEditing(true)}>
              <ReactMarkdown
                className='prose'
                children={text || 'Enter some markdown text here...'}
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
                }}
              />
            </div>
          )}
        </Box>
      </Paper>
    </Stack>
  );
};

export default MarkdownCell;
