import { Box, Typography, Menu, MenuItem, InputBase, useTheme } from '~/utils/MuiImports';
import { CheckIcon, CloseIcon, IconButton } from '~/utils/MuiImports';
import { StyledTreeItem } from '~/components/UI/StyledTreeComponents';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { NotebookType } from '@/NotebookTypes';
import { useMutation } from 'react-query';
import { editDocTitle, deleteDoc } from '~/services/dynamoPost';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import ListIconJs from './assets/listjs.svg';
import ListIconPy from './assets/listpy.svg';

interface TreeNotebookProps {
  notebook: NotebookType;
  username: string;
  index: number;
  refetch: () => void;
  setSelectedDocId: (docID: string) => void;
}

const TreeNotebook = ({ index, notebook, username, refetch, setSelectedDocId }: TreeNotebookProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(notebook.title || '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme().palette.mode;
  const inputRef = useRef<HTMLElement | null>(null);

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
    setAnchorEl(null);
    setNewTitle(notebook.title || '');
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 0);
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
    e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>
  ) => {
    e.stopPropagation();
    setTimeout(() => {
      setIsEditing(false);
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleSaveClick(e);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const iconSize = '16px';
  const iconPyWidth = '20px';
  const iconPyHeight = '20px';
  const treeFont = 'Lato';

  return (
    <Box>
      {isEditing ? (
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10 }}
          onBlur={handleCancelClick}>
          <InputBase
            ref={inputRef}
            sx={{
              fontFamily: treeFont,
              color: theme === 'light' ? '#2c3032' : '#fff',
              fontSize: '0.85rem',
              flexGrow: 1
            }}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            // onBlur={handleCancelClick}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <IconButton onClick={handleSaveClick} sx={{ color: 'green' }}>
            <CheckIcon sx={{ fontSize: iconSize }} />
          </IconButton>
          <IconButton onClick={handleCancelClick} sx={{ color: 'red' }}>
            <CloseIcon sx={{ fontSize: iconSize }} />
          </IconButton>
        </div>
      ) : (
        <StyledTreeItem
          onClick={() => setSelectedDocId(notebook.docID)}
          icon={
            <img
              src={notebook.language === 'javascript' ? ListIconJs : ListIconPy}
              alt='List Icon'
              width={iconPyWidth}
              height={iconPyHeight}
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
                  fontFamily: treeFont,
                  color: theme === 'light' ? '#2c3032' : '#fff',
                  fontSize: '0.85rem',
                  flexGrow: 1
                }}>
                {notebook.title || `Untitled-${index}`}
              </Typography>
              <IconButton onClick={e => handleClick(e)} sx={{ width: '28px', height: '28px' }}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClickToNavigate}>Open</MenuItem>
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
