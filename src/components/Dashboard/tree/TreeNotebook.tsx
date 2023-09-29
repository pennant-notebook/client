import { Box, Typography, Menu, MenuItem, InputBase, useTheme } from '~/utils/MuiImports';
import { CheckIcon, CloseIcon, IconButton } from '~/utils/MuiImports';
import { StyledTreeItem } from '~/components/UI/StyledTreeComponents';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { NotebookType } from '@/NotebookTypes';
import { useMutation } from 'react-query';
import { editDocTitle, deleteDoc } from '~/services/dynamoPost';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import ListIconJs from './listjs.png';
import ListIconPy from './listpy.png';

interface TreeNotebookProps {
  notebook: NotebookType;
  username: string;
  index: number;
  refetch: () => void;
}

const TreeNotebook = ({ index, notebook, username, refetch }: TreeNotebookProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(notebook.title || '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme().palette.mode;

  const handleClickToNavigate = () => {
    if (isEditing) return;
    navigate(`/${username}/${notebook.docID}`);
  };

  const deleteMutation = useMutation(deleteDoc, {
    onSuccess: () => {
      refetch();
    }
  });

  const editMutation = useMutation(editDocTitle, {
    onSuccess: () => {
      refetch();
    }
  });

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleRenameClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
    setNewTitle(notebook.title || '');
    setIsEditing(true);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this notebook?') && username) {
      deleteMutation.mutate(
        { docID: notebook.docID, username },
        {
          onSuccess: () => {
            toast.success(`Successfully deleted ${notebook.title || 'untitled notebook'}`);
          }
        }
      );
    }
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    e.stopPropagation();
    if (username) {
      editMutation.mutate({ docID: notebook.docID, title: newTitle, username: username });
    }
    setIsEditing(false);
  };

  const handleCancelClick = (
    e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.stopPropagation();
    setTimeout(() => {
      setIsEditing(false);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleSaveClick(e);
    }
    if (e.key === 'Escape') {
      setTimeout(() => {
        setIsEditing(false);
      }, 100);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const iconSize = '16px';

  return (
    <Box>
      {isEditing ? (
        <StyledTreeItem
          nodeId={notebook.docID}
          label={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <InputBase
                sx={{
                  fontFamily: 'Inter',
                  color: theme === 'light' ? '#2c3032' : '#fff',
                  fontSize: '0.85rem',
                  flexGrow: 1
                }}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onBlur={handleCancelClick}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <IconButton onClick={handleSaveClick} sx={{ color: 'green' }}>
                <CheckIcon sx={{ fontSize: iconSize }} />
              </IconButton>
              <IconButton onClick={handleCancelClick} sx={{ color: 'red' }}>
                <CloseIcon sx={{ fontSize: iconSize }} />
              </IconButton>
            </Box>
          }
        />
      ) : (
        <StyledTreeItem
          icon={
            <img
              src={notebook.language === 'javascript' ? ListIconJs : ListIconPy}
              alt='List Icon'
              width={16}
              height={20}
            />
          }
          nodeId={notebook.docID}
          label={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                height: '36px'
              }}>
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  color: theme === 'light' ? '#2c3032' : '#fff',
                  fontSize: '0.85rem',
                  flexGrow: 1
                }}>
                {notebook.title || `Untitled-${index}`}
              </Typography>
              <IconButton onClick={e => handleClick(e)}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClickToNavigate}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                <MenuItem onClick={handleRenameClick}>Rename</MenuItem>
              </Menu>
            </Box>
          }
        />
      )}
    </Box>
  );
};
export default TreeNotebook;
