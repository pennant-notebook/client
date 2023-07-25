import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IconButton, Box, Typography, Stack, ArrowBack, FolderOpen, Button } from '../../../utils/MuiImports';
import { Brightness4, Brightness7, useTheme, Edit, Folder, Drawer } from '../../../utils/MuiImports';
import { getClientFromLocalStorage } from '../../../utils/awarenessHelpers';
import Avatar from 'react-avatar';
import { fetchNotebooks } from '../../../services/dynamoFetch';
import IconRow from '../IconRow';
import { useQuery } from 'react-query';
import { styled } from '@mui/material';
import { grey } from '@mui/material/colors';
import useProviderContext from '../../../contexts/ProviderContext';

const StyledButton = styled(Button)({
  position: 'relative',
  marginLeft: '2rem',
  maxWidth: '160px',
  cursor: 'pointer',
  border: 'none',

  textTransform: 'capitalize',
  textAlign: 'left',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-10px',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: '#e0e0e0'
  }
});
const ClientDrawer = ({ handleDisconnect, clients = [] }) => {
  const [open, setOpen] = useState(false);
  const [showNotebooks, setShowNotebooks] = useState(false);
  const { username } = useParams();
  const [avatar, setAvatar] = useState(clients[0]);
  const { data: notebooks } = useQuery(['notebooks', username], () => fetchNotebooks(username));
  const { provider } = useProviderContext();
  const {
    custom: { currTheme, toggleTheme }
  } = useTheme();

  const handleEditNameClick = () => {
    let newName = window.prompt('Enter a new name:');
    if (newName) {
      setAvatar(prevAvatar => ({ ...prevAvatar, name: newName }));
      provider.awareness.setLocalStateField('user', { ...avatar, name: newName, setByUser: true });
      localStorage.setItem('userData', JSON.stringify({ name: newName, color: avatar.color, setByUser: true }));
    }
  };

  const handleFolderClick = () => {
    setShowNotebooks(!showNotebooks);
  };

  useEffect(() => {
    if (clients && clients.length > 0) {
      setAvatar(clients[0]);
      // console.log('setting avatar from clients', clients[0]);
    } else {
      const storedClient = getClientFromLocalStorage();
      // console.log('setting avatar from local storage', storedClient);
      setAvatar(storedClient);
    }
  }, [clients]);

  return (
    <Box sx={{ alignItems: 'center' }}>
      {avatar && !open ? (
        <IconButton onClick={() => setOpen(true)} sx={{ mr: 1 }}>
          <Avatar
            name={avatar.name}
            size='28'
            round='30px'
            textSizeRatio={3}
            color={avatar.color}
            sx={{ fontSize: '26px' }}
          />
        </IconButton>
      ) : (
        <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: '220px', padding: '20px' }}>
            <Stack spacing={3} sx={{ alignItems: 'left' }}>
              {avatar && (
                <Stack sx={{ alignItems: 'center' }} spacing={3}>
                  <Avatar name={avatar.name} size={60} round='30px' color={avatar.color} />
                  <Stack direction='row' alignItems='center'>
                    <Typography variant='h5'>{avatar.name}</Typography>
                    <IconButton size='small' onClick={handleEditNameClick} sx={{ ml: 1 }}>
                      <Edit />
                    </IconButton>
                  </Stack>
                </Stack>
              )}
              <IconRow
                onClick={toggleTheme}
                text={`Toggle ${currTheme === 'dark' ? 'light' : 'dark'} mode`}
                icon={currTheme === 'dark' ? <Brightness7 sx={{ color: '#e0e0e0' }} /> : <Brightness4 />}
              />
              <Box sx={{ pl: 1, textAlign: 'left' }}>
                <IconRow
                  onClick={handleFolderClick}
                  text={username}
                  icon={showNotebooks ? <FolderOpen /> : <Folder />}
                />
                {showNotebooks &&
                  notebooks?.map((notebook, index) => (
                    <StyledButton
                      onClick={() => handleDisconnect(`/${username}/${notebook.docID}`)}
                      key={notebook.docID}>
                      <Typography noWrap sx={{ fontSize: '14px', fontFamily: 'Lato', color: grey[800] }}>
                        {notebook.title || `Untitled-${index}`}
                      </Typography>
                    </StyledButton>
                  ))}
              </Box>
              <Box sx={{ pl: 1 }}>
                <IconRow onClick={() => handleDisconnect(`/${username}`)} text='Dashboard' icon={<ArrowBack />} />
              </Box>
            </Stack>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};
export default ClientDrawer;
