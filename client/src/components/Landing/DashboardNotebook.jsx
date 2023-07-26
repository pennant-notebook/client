import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { TextField, Card, Typography, useTheme } from '../../utils/MuiImports';
import { Edit, DeleteIcon, CheckIcon, CloseIcon, IconButton } from '../../utils/MuiImports';
import { useMutation } from 'react-query';
import { deleteDoc, editDocTitle } from '../../services/dynamoPost';
import { toast } from 'react-toastify';

const DashboardNotebook = ({ docID, title, index, refetch }) => {
  const { username } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

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

  const handleSaveClick = e => {
    e.stopPropagation();
    editMutation.mutate({ docID, title: newTitle, username });
    setIsEditing(false);
  };

  const handleCancelClick = e => {
    e.stopPropagation();
    setIsEditing(false);
    setNewTitle(title);
  };

  const handleDeleteClick = e => {
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this notebook?')) {
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

  const handleEditClick = e => {
    e.stopPropagation();
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
      className={`button-4 ${theme.palette.mode}`}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {isEditing ? (
        <TextField value={newTitle} onChange={e => setNewTitle(e.target.value)} />
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
            <IconButton onClick={handleSaveClick} color='primary'>
              <CheckIcon sx={{ fontSize: iconSize }} />
            </IconButton>
            <IconButton onClick={handleCancelClick} color='secondary'>
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
