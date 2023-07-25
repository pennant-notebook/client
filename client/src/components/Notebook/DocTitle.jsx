import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Box,
  Typography
} from '../../utils/MuiImports';
import { useParams } from 'react-router-dom';
import { fetchDoc } from '../../services/dynamoFetch';
import { editDocTitle } from '../../services/dynamoPost';

import useNotebookContext from '../../contexts/NotebookContext';
import { useQuery } from 'react-query';

const DocTitle = () => {
  const { username, docID } = useParams();
  const { data: notebook } = useQuery([docID, username], () => fetchDoc(docID, username));

  const { handleTitleChange, title } = useNotebookContext();
  const [open, setOpen] = useState(false);

  const [tempTitle, setTempTitle] = useState(notebook.title);

  const handleEditTitle = async () => {
    try {
      const newNotebookData = await editDocTitle(notebook.docID, tempTitle, username);
      handleTitleChange(newNotebookData.title);
      setTempTitle('');
      setOpen(false);
    } catch (error) {
      console.error('Error updating notebook title:', error);
    }
  };

  return (
    <Box className='notebook-title'>
      <Box onClick={() => setOpen(true)}>
        <Typography
          sx={{
            maxWidth: { xs: '150px', sm: '200px', md: '400px' },
            opacity: 0.5,
            fontSize: '20px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}>
          {title === notebook?.docID ? 'untitled' : title}
        </Typography>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Notebook Title</DialogTitle>
        <DialogContent sx={{ minWidth: '300px' }}>
          <TextField
            autoFocus
            margin='dense'
            label='New title'
            type='text'
            fullWidth
            value={tempTitle}
            onChange={event => setTempTitle(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleEditTitle}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocTitle;
