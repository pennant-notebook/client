import { Box, Typography, Menu, MenuItem, InputBase } from '~/utils/MuiImports';
import { CheckIcon, CloseIcon, IconButton, MoreVertIcon, FileCopyIcon } from '~/utils/MuiImports';
import { StyledTreeItem } from '~/components/UI/StyledTreeComponents';
import { NotebookType } from '@/NotebookTypes';
import { useMutation, useQuery } from 'react-query';
import { editDocTitle, deleteDoc } from '~/services/dynamoPost';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import ListIconJs from './assets/listjs.svg';
import ListIconPy from './assets/listpy.svg';
import { useRecoilState } from 'recoil';
import { notebookTitleStateFamily, notebooksState, selectedDocIdState } from '~/appState';
import { fetchDoc } from '~/services/dynamoFetch';
import styles from './TreeNotebook.module.css';

interface TreeNotebookProps {
  notebook: NotebookType;
  username: string;
  index: number;
  handleSelectedDocId: (docID: string) => void;
}

const TreeNotebook = ({ index, notebook, username, handleSelectedDocId }: TreeNotebookProps) => {
  const [notebooks, setNotebooks] = useRecoilState(notebooksState);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(notebook.title || '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLElement | null>(null);
  const [title, setTitle] = useRecoilState(notebookTitleStateFamily(notebook.docID));
  const [selectedDocId, setSelectedDocId] = useRecoilState(selectedDocIdState);

  const { data: fetchedNotebook, refetch } = useQuery<NotebookType>([notebook.docID, username], () =>
    fetchDoc(notebook.docID as string, username as string)
  );

  useEffect(() => {
    setTitle(fetchedNotebook?.title || notebook.title || `Untitled-${index}`);
  }, [notebook]);

  const handleClickToNavigate = () => {
    if (isEditing) return;
    navigate(`/${username}/${notebook.docID}`);
  };

  const deleteMutation = useMutation(deleteDoc, {
    onSuccess: () => {
      setNotebooks(notebooks.filter(n => n.docID !== notebook.docID));
      if (selectedDocId === notebook.docID) {
        setSelectedDocId(null);
      }
    }
  });

  const editMutation = useMutation(editDocTitle, {
    onSuccess: () => {
      setTitle(newTitle);
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
    const target = e.relatedTarget as HTMLElement;
    if (target && target.id === 'save-button') return;
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

  const handleCopyClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const notebookURL = `https://trypennant.com/${username}/${notebook.docID}`;
    navigator.clipboard
      .writeText(notebookURL)
      .then(() => {
        toast.success('Notebook URL copied to clipboard');
      })
      .catch(err => {
        toast.error('Failed to copy URL: ' + err);
      });
  };

  const iconSize = '16px';
  const iconPyWidth = '20px';
  const iconPyHeight = '20px';

  return (
    <Box>
      {isEditing ? (
        <div className={styles.editingContainer} onBlur={handleCancelClick}>
          <InputBase
            ref={inputRef}
            className={styles.inputBase}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleCancelClick}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <IconButton id='save-button' onClick={handleSaveClick} className={styles.iconButtonGreen}>
            <CheckIcon sx={{ fontSize: iconSize }} />
          </IconButton>
          <IconButton onClick={handleCancelClick} className={styles.iconButtonRed}>
            <CloseIcon sx={{ fontSize: iconSize }} />
          </IconButton>
        </div>
      ) : (
        <StyledTreeItem
          onClick={() => handleSelectedDocId(notebook.docID)}
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
            <Box className={styles.treeItemContainer}>
              <Typography className={styles.treeItemTypography}>{title || `Untitled-${index}`}</Typography>
              <IconButton onClick={e => handleClick(e)} className={styles.iconButton}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClickToNavigate} className={styles.menuItem}>
                  Open
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} className={styles.menuItem}>
                  Delete
                </MenuItem>
                <MenuItem onClick={handleRenameClick} className={styles.menuItem}>
                  Rename
                </MenuItem>
                <MenuItem onClick={handleCopyClick} className={styles.menuItem}>
                  <FileCopyIcon fontSize='small' className={styles.fileCopyIcon} />
                  Copy Notebook URL
                </MenuItem>
              </Menu>
            </Box>
          }
        />
      )}
    </Box>
  );
};
export default TreeNotebook;
