import { useState, useEffect, MouseEvent, FocusEvent, KeyboardEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, Typography, useTheme, InputBase } from '../../utils/MuiImports';
import { Edit, DeleteIcon, CheckIcon, CloseIcon, IconButton } from '../../utils/MuiImports';
import { useMutation } from 'react-query';
import { deleteDoc, editDocTitle } from '../../services/dynamoPost';
import { toast } from 'react-toastify';
import styles from './DashboardNotebook.module.css';

interface DashboardNotebookProps {
  docID: string;
  title: string;
  index: number;
  refetch: () => void;
  isNewNotebook?: boolean;
}

const DashboardNotebook = ({ docID, title, index, refetch, isNewNotebook }: DashboardNotebookProps) => {
  const { username } = useParams<{ username: string }>();
  const [isEditing, setIsEditing] = useState(isNewNotebook);
  const [newTitle, setNewTitle] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isNewNotebook) {
      setIsEditing(true);
    }
  }, [isNewNotebook]);

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

  const handleSaveClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (username) {
      editMutation.mutate({ docID, title: newTitle, username: username });
    }
    setIsEditing(false);
  };

  const handleCancelClick = (e: MouseEvent<HTMLElement> | FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    setTimeout(() => {
      setIsEditing(false);
    }, 100);
  };

  const handleDeleteClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this notebook?') && username) {
      deleteMutation.mutate(
        { docID, username },
        {
          onSuccess: () => {
            toast.success(`Successfully deleted ${title || 'untitled notebook'}`);
          }
        }
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      handleSaveClick(e as unknown as MouseEvent<HTMLElement>);
    }
    if (e.key === 'Escape') {
      handleCancelClick(e as unknown as MouseEvent<HTMLElement>);
    }
  };

  const handleEditClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setNewTitle(title || '');
    setIsEditing(true);
  };

  const handleClickToNavigate = () => {
    if (isEditing) return;
    navigate(`/${username}/${docID}`);
  };

  const iconSize = '16px';
  return (
    <Card
      onClick={handleClickToNavigate}
      className={`${styles.dashboardButton} ${theme.palette.mode}`}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {isEditing ? (
        <InputBase
          onBlur={handleCancelClick}
          autoFocus
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          sx={{
            fontFamily: 'Lato',
            fontSize: '0.9rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        />
      ) : (
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '0.9rem',
            fontFamily: 'Lato'
          }}>
          {title || `Untitled-${index}`}
        </Typography>
      )}
      <div>
        {isEditing ? (
          <>
            <IconButton onClick={handleSaveClick} sx={{ color: 'green' }}>
              <CheckIcon sx={{ fontSize: iconSize }} />
            </IconButton>
            <IconButton onClick={handleCancelClick} sx={{ color: 'red' }}>
              <CloseIcon sx={{ fontSize: iconSize }} />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={handleEditClick} color='primary'>
              <Edit sx={{ fontSize: iconSize }} />
            </IconButton>
            <IconButton onClick={handleDeleteClick} color='secondary'>
              <DeleteIcon sx={{ fontSize: iconSize }} />
            </IconButton>
          </>
        )}
      </div>
    </Card>
  );
};
export default DashboardNotebook;
