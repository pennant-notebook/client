import { useRef } from 'react';
import { Box, IconButton, Stack, Tooltip, CloseSharp } from '../../MuiImports';
import useNotebookContext from '../../../contexts/NotebookContext';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';

const MarkdownCell = ({ id, content, provider }) => {
  const { deleteCell } = useNotebookContext();

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
    <Stack
      direction='row'
      sx={{ width: '82%', alignItems: 'center', margin: '0 auto', position: 'relative' }}
      ref={cellRef}>
      <Box style={{ flexGrow: 1, borderRadius: '5px', position: 'relative' }}>
        <Stack direction='row' sx={{ position: 'absolute', top: '-9px', right: 0, zIndex: 1 }}>
          <Tooltip title='Remove cell'>
            <IconButton
              onClick={() => deleteCell(id)}
              sx={{ justifyContent: 'end', opacity: 0.3, '&:hover': { opacity: 0.7, backgroundColor: 'transparent' } }}>
              <CloseSharp sx={{ color: 'dimgray' }} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Box
          sx={{ ml: '-20px' }}
          onMouseEnter={() => (cellRef.current.style.cursor = 'text')}
          onMouseLeave={() => (cellRef.current.style.cursor = 'grab')}>
          <BlockNoteView id={id} editor={editor} />
        </Box>
      </Box>
    </Stack>
  );
};

export default MarkdownCell;
