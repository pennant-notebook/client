import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Typography
} from '../../utils/MuiImports';
import { useParams } from 'react-router-dom';
import { fetchDoc } from '../../services/dynamoFetch';
import { editDocTitle } from '../../services/dynamoPost';

import { useMutation, useQuery } from 'react-query';

const DocTitle = () => {
  const { username, docID } = useParams();
  const { data: notebook, refetch } = useQuery([docID, username], () => fetchDoc(docID, username));

  const [open, setOpen] = useState(false);

  const [tempTitle, setTempTitle] = useState(notebook?.title || '');

  const editMutation = useMutation(editDocTitle, {
    onSuccess: () => {
      refetch();
    }
  });

  const handleEditTitle = () => {
    try {
      editMutation.mutate({ docID: notebook.docID, title: tempTitle, username });
      setOpen(false);
    } catch (error) {
      console.error('Error updating notebook title:', error);
    }
  };

  useEffect(() => {
    setTempTitle(notebook?.title || '');
  }, [notebook?.title]);

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
          {notebook?.title === notebook?.docID ? 'untitled' : notebook.title}
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
