import { useState } from 'react';
import { useParams } from 'react-router';
import { IconButton, Box, Typography, Stack, ArrowBack } from '../../../utils/MuiImports';
import { Brightness4, Brightness7, useTheme, Edit, Folder, Drawer } from '../../../utils/MuiImports';
import { getClientFromLocalStorage } from '../../../utils/awarenessHelpers';
import Avatar from 'react-avatar';

const ClientDrawer = ({ handleDisconnect }) => {
  const client = getClientFromLocalStorage();
  const [open, setOpen] = useState(false);
  const { username, docID } = useParams();
  const [avatar, setAvatar] = useState(client);

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

  return (
    <Box sx={{ alignItems: 'center' }}>
      {avatar && docID && !open ? (
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
            <Stack spacing={3} sx={{ alignItems: 'center' }}>
              {avatar && (
                <>
                  <Avatar name={avatar.name} size={60} round='30px' color={avatar.color} />
                  <Stack direction='row' alignItems='center'>
                    <Typography variant='h5'>{avatar.name}</Typography>
                    <IconButton size='small' onClick={handleEditNameClick} sx={{ ml: 1 }}>
                      <Edit />
                    </IconButton>
                  </Stack>
                </>
              )}
              <Stack direction='row' sx={{ justifyContent: 'center', textAlign: 'center' }}>
                <IconButton onClick={toggleTheme} sx={{ borderRadius: '12px' }}>
                  {currTheme === 'dark' ? <Brightness7 sx={{ color: '#e0e0e0' }} /> : <Brightness4 />}

                  <Typography sx={{ fontFamily: 'Lato', fontSize: '1rem', ml: 1 }}>
                    Toggle {currTheme === 'dark' ? 'light' : 'dark'} mode
                  </Typography>
                </IconButton>
              </Stack>
              <IconButton onClick={() => handleDisconnect(`/${username}`)} sx={{ borderRadius: '12px' }}>
                <Stack direction='row' spacing={1} alignItems='center' justifyContent='center'>
                  <ArrowBack />
                  <Folder />
                  <Typography sx={{ fontFamily: 'Lato', fontSize: '1rem' }}>{username}</Typography>
                </Stack>
              </IconButton>
            </Stack>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};
export default ClientDrawer;
