import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDoc } from '~/services/dynamoFetch';
import { editDocTitle } from '~/services/dynamoPost';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '~/utils/MuiImports';

import { useMutation, useQuery } from 'react-query';
import JsExtIcon from '~/assets/app/js-file.png';
import PyExtIcon from '~/assets/app/python.png';

interface NotebookType {
  docID: string;
  title?: string;
}

interface DocTitleProps {
  selectedDoc?: string;
  language?: string;
}

const DocTitle = ({ selectedDoc, language }: DocTitleProps) => {
  const { username, docID: paramsDoc } = useParams();

  const docID = paramsDoc || selectedDoc;

  const { data: notebook, refetch } = useQuery<NotebookType>([docID, username], () =>
    fetchDoc(docID as string, username as string)
  );

  const [open, setOpen] = useState(false);

  const [tempTitle, setTempTitle] = useState(notebook?.title || '');

  const editMutation = useMutation(editDocTitle, {
    onSuccess: () => {
      refetch();
    }
  });

  const handleEditTitle = () => {
    try {
      if (notebook && username) {
        editMutation.mutate({ docID: notebook.docID, title: tempTitle, username });
      }
      setOpen(false);
    } catch (error) {
      console.error('Error updating notebook title:', error);
    }
  };

  useEffect(() => {
    if (notebook) {
      setTempTitle(notebook.title || '');
    }
  }, [notebook]);

  return (
    <Box className='notebook-title' sx={{ mr: '2px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => setOpen(true)}>
        <Box sx={{ display: 'flex', opacity: 0.7 }}>
          {language === 'python' ? (
            <img src={PyExtIcon} width='18' height='18' style={{ marginRight: '10px' }} />
          ) : language === 'javascript' ? (
            <img src={JsExtIcon} width='18' height='18' style={{ marginRight: '10px' }} />
          ) : (
            <></>
          )}
        </Box>
        <Typography
          sx={{
            maxWidth: { xs: '150px', sm: '200px', md: '400px' },
            opacity: 0.5,
            fontSize: '20px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}>
          {notebook && notebook.title === notebook.docID
            ? 'untitled'
            : notebook && notebook.title
            ? notebook.title
            : 'untitled'}
        </Typography>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            position: 'absolute',
            top: window.innerHeight > 768 ? '25%' : '20%',
            width: '370px',
            left: 0,
            right: 0,
            margin: 'auto'
          }
        }}>
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
