import { useEffect, useState } from 'react';
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
import { editDocTitleInDynamo, fetchDocFromDynamo } from '../../services/dynamo';
import useNotebookContext from '../../contexts/NotebookContext';

const DocTitle = () => {
  const { username, docID } = useParams();
  const { handleTitleChange, title } = useNotebookContext();
  const [open, setOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [notebook, setNotebook] = useState(null);

  useEffect(() => {
    async function getNotebook() {
      const fetchedNotebook = await fetchDocFromDynamo(docID, username);
      setNotebook(fetchedNotebook);
      if (fetchedNotebook.title) {
        handleTitleChange(fetchedNotebook.title);
      }
    }
    getNotebook();
  }, []);

  const handleEditTitle = async () => {
    try {
      // const slug = slugify(tempTitle);
      const newNotebookData = await editDocTitleInDynamo(notebook.docID, tempTitle, username);
      handleTitleChange(newNotebookData.title);
      setTempTitle('');
      setOpen(false);
    } catch (error) {
      console.error('Error updating notebook title:', error);
    }
  };

  return (
    <Box className='notebook-title'>
      <Box onClick={() => setOpen(true)} sx={{ ml: { xs: 3, sm: 0, lg: 2, xl: 4 } }}>
        <Typography sx={{ opacity: 0.5, fontSize: '20px' }}>
          {title === notebook?.docID ? 'untitled' : title}
        </Typography>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Notebook Title</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the new title here.</DialogContentText>
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
