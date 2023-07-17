import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Typography,
  Box
} from '../../utils/MuiImports';
import { useNavigate, useParams } from 'react-router-dom';
import { editDocTitleInDynamo, fetchDocFromDynamo } from '../../services/dynamo';
import { slugify } from '../../utils/notebookHelpers';

const EditTitle = () => {
  const [open, setOpen] = useState(false);
  const { username, docID } = useParams();

  const [title, setTitle] = useState(docID);
  const [tempTitle, setTempTitle] = useState('');
  const [notebook, setNotebook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getNotebook() {
      const fetchedNotebook = await fetchDocFromDynamo(username, docID);
      setNotebook(fetchedNotebook);
      setTitle(fetchedNotebook.title);
    }
    getNotebook();
  }, []);

  const handleEditTitle = async () => {
    try {
      const slug = slugify(tempTitle);

      const newNotebookData = await editDocTitleInDynamo(username, notebook.docID, tempTitle, slug);
      setTitle(newNotebookData.title);
      setTempTitle('');
      setOpen(false);
      navigate(`/${username}/${slug}`);
    } catch (error) {
      console.error('Error updating notebook title:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexGrow: '1', flexDirection: 'row' }}>
      <Typography sx={{ opacity: 0.5, fontSize: '18px' }} onClick={() => setOpen(true)}>
        {title === notebook?.docID ? 'untitled' : title}
      </Typography>

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
            value={title === docID && !tempTitle ? '' : tempTitle}
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

export default EditTitle;
