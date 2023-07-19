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
  Typography,
  IconButton
} from '../../utils/MuiImports';
import CreateTwoTone from '@mui/icons-material/CreateTwoTone';
import { useParams } from 'react-router-dom';
import { editDocTitleInDynamo, fetchDocFromDynamo } from '../../services/dynamo';
import { slugify } from '../../utils/notebookHelpers';
import useNotebookContext from '../../contexts/NotebookContext';

const DocTitle = () => {
  const { username, docID } = useParams();
  const { handleTitleChange, title } = useNotebookContext();
  const [open, setOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [notebook, setNotebook] = useState(null);

  useEffect(() => {
    async function getNotebook() {
      const fetchedNotebook = await fetchDocFromDynamo(username, docID);
      setNotebook(fetchedNotebook);
      if (fetchedNotebook.title) {
        handleTitleChange(fetchedNotebook.title);
      }
    }
    getNotebook();
  }, []);

  const handleEditTitle = async () => {
    try {
      const slug = slugify(tempTitle);
      const newNotebookData = await editDocTitleInDynamo(username, notebook.docID, tempTitle, slug);
      handleTitleChange(newNotebookData.title);
      setTempTitle('');
      setOpen(false);
    } catch (error) {
      console.error('Error updating notebook title:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ opacity: 0.5, fontSize: '18px' }}>{title === notebook?.docID ? 'untitled' : title}</Typography>
      <IconButton onClick={() => setOpen(true)} color='inherit' sx={{ p: 0, m: 0, ml: 1 }}>
        <CreateTwoTone sx={{ fontSize: '16px' }} />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Notebook Title</DialogTitle>
        <DialogContent>
          <DialogContentText>To edit the title, please enter the new title here.</DialogContentText>
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
