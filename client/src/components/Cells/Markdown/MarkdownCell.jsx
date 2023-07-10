import { useRef } from 'react';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { CloseSharp } from '@mui/icons-material';
import useNotebookContext from '../../../contexts/NotebookContext';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';

const MarkdownToolbar = ({ id }) => {
  const { deleteCell } = useNotebookContext();
  return (
    <Stack direction='row' sx={{ justifyContent: 'end' }}>
      <Tooltip title='Remove cell'>
        <IconButton
          onClick={() => deleteCell(id)}
          sx={{ justifyContent: 'end', opacity: 0.3, '&:hover': { opacity: 0.7, backgroundColor: 'transparent' } }}>
          <CloseSharp sx={{ color: 'dimgray' }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

const MarkdownCell = ({ id, content, provider }) => {
  const cellRef = useRef(null);
  const editor = useBlockNote({
    collaboration: {
      provider,
      fragment: content,
      user: {
        name: 'Sarah',
        color: '#ff0000'
      }
    }
  });

  return (
    <Stack direction='row' sx={{ width: '82%', alignItems: 'center', margin: '0 auto' }} ref={cellRef}>
      <Box style={{ flexGrow: 1, borderRadius: '5px' }}>
        <MarkdownToolbar id={id} />
        <Box
          onMouseEnter={() => (cellRef.current.style.cursor = 'text')}
          onMouseLeave={() => (cellRef.current.style.cursor = 'grab')}>
          <BlockNoteView id={id} editor={editor} />
        </Box>
      </Box>
    </Stack>
  );
};

export default MarkdownCell;
