import { Box, IconButton, Paper, Stack, Tooltip, GlobalStyles } from '@mui/material';
import { CloseSharp } from '@mui/icons-material';
import useNotebookContext from '../../../contexts/NotebookContext';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';

const MarkdownCell = ({ id, content }) => {
  const { deleteCell, provider } = useNotebookContext();
  const editor = useBlockNote({
    // theme: 'dark',
    editorDOMAttributes: { class: 'custom-editor' },
    // onEditorContentChange: editor => {
    //   const textBlocks = editor.topLevelBlocks.flatMap(block => block.content.map(c => c.text));
    //   console.log(textBlocks); // should log ['Hello', 'World']
    //   // console.log(yContent.toString());
    // },
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
    <>
      <GlobalStyles
        styles={{
          '.custom-editor': {
            marginLeft: '-50px' // adjust as needed
          }
        }}
      />
      <Stack sx={{ width: '100%' }}>
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
          <Box sx={{ position: 'absolute', top: '0', right: '0', zIndex: '1' }}>
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
    </>
  );
};

export default MarkdownCell;
