import { Box, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { CloseSharp } from '@mui/icons-material';
import useNotebookContext from '../../../contexts/NotebookContext';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import { useEffect, useState } from 'react';

const initialBlocks = [
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'Hello',
        styles: {}
      }
    ]
  },
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'World',
        styles: {}
      }
    ]
  }
];

const MarkdownCell = ({ id, xmlFragment }) => {
  const { deleteCell, provider } = useNotebookContext();
  const [initialBlocksInserted, setInitialBlocksInserted] = useState(false);

  const editor = useBlockNote({
    onEditorContentChange: editor => {
      const textBlocks = editor.topLevelBlocks.flatMap(block => block.content.map(c => c.text));
      console.log(textBlocks); // should log ['Hello', 'World']
      console.log(xmlFragment.toString());
    },
    collaboration: {
      provider,
      fragment: xmlFragment,
      user: {
        name: 'Sarah',
        color: '#ff0000'
      }
    }
  });

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
          <BlockNoteView id={id} editor={editor} />
        </Box>
      </Paper>
    </Stack>
  );
};

export default MarkdownCell;
