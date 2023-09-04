import { ClientType } from '@/ClientTypes';
import { NotebookType } from '@/NotebookTypes';
import React, { useCallback, useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import useProviderContext from '../../../contexts/ProviderContext';
import { fetchNotebooks } from '../../../services/dynamoFetch';
import {
  ArrowBack,
  Box,
  Brightness4,
  Brightness7,
  Drawer,
  Edit,
  Folder,
  FolderOpen,
  IconButton,
  Stack,
  Typography,
  grey,
  useTheme
} from '../../../utils/MuiImports';
import { getClientFromLocalStorage } from '../../../utils/awarenessHelpers';
import IconRow from '../IconRow';
import { StyledButton } from '../StyledComponents';
import styles from './Clients.module.css';
import ThemeSelector from './ThemeSelector';

interface ClientDrawerProps {
  handleDisconnect: (destination: string) => void;
  clients?: ClientType[];
}

const ClientDrawer: React.FC<ClientDrawerProps> = ({ handleDisconnect, clients = [] }) => {
  const [open, setOpen] = useState(false);
  const [showNotebooks, setShowNotebooks] = useState(false);
  const { username } = useParams();
  const [avatar, setAvatar] = useState(clients[0]);
  const { data: notebooks } = useQuery(['notebooks', username], () => username && fetchNotebooks(username));
  const providerContext = useProviderContext();
  const provider = providerContext ? providerContext.provider : null;

  const {
    custom: { currTheme, toggleTheme }
  } = useTheme();

  const handleEditNameClick = useCallback(() => {
    let newName = window.prompt('Enter a new name:');
    if (newName) {
      setAvatar(prevAvatar => ({
        ...prevAvatar,
        name: newName || prevAvatar.name
      }));
      provider?.awareness.setLocalStateField('user', { ...avatar, name: newName, setByUser: true });
      localStorage.setItem('userData', JSON.stringify({ name: newName, color: avatar?.color, setByUser: true }));
    }
  }, [avatar, provider?.awareness]);

  const handleFolderClick = () => {
    setShowNotebooks(!showNotebooks);
  };

  useEffect(() => {
    if (clients && clients.length > 0) {
      setAvatar(clients[0]);
    } else {
      const storedClient: ClientType = getClientFromLocalStorage();
      setAvatar(storedClient);
    }
  }, [clients]);

  return (
    <Box sx={{ alignItems: 'center' }}>
      {avatar && (
        <IconButton onClick={() => setOpen(true)} sx={{ mx: 1, p: 0 }}>
          <Box className={styles.localWidget}>
            <Avatar name={avatar.name} size='30' round='30px' textSizeRatio={3} color={avatar.color} />
          </Box>
        </IconButton>
      )}

      <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: '220px', padding: '20px' }}>
          <Stack spacing={3} sx={{ alignItems: 'left' }}>
            {avatar && (
              <Stack sx={{ alignItems: 'center' }} spacing={3}>
                <Avatar name={avatar.name} size='60' round='30px' color={avatar.color} />
                <Stack direction='row' alignItems='center'>
                  <Typography variant='h5'>{avatar.name}</Typography>
                  <IconButton size='small' onClick={handleEditNameClick} sx={{ ml: 1 }}>
                    <Edit />
                  </IconButton>
                </Stack>
              </Stack>
            )}

            <Box sx={{ width: '100%', textAlign: 'left' }}>
              <IconRow
                onClick={toggleTheme}
                text={`Toggle ${currTheme === 'dark' ? 'light' : 'dark'} mode`}
                icon={currTheme === 'dark' ? <Brightness7 sx={{ color: '#e0e0e0' }} /> : <Brightness4 />}
              />

              <ThemeSelector />

              <Box id='notebooks-folder'>
                <IconRow
                  onClick={handleFolderClick}
                  text={username}
                  icon={showNotebooks ? <FolderOpen /> : <Folder />}
                />
                {showNotebooks &&
                  notebooks?.map((notebook: NotebookType, index: number) => (
                    <StyledButton
                      onClick={() => handleDisconnect(`/${username}/${notebook.docID}`)}
                      style={{ textAlign: 'left' }}
                      key={notebook.docID}>
                      <Typography
                        noWrap
                        sx={{
                          fontSize: '14px',
                          fontFamily: 'Lato',
                          color: currTheme == 'dark' ? grey[300] : grey[700]
                        }}>
                        {notebook.title || `Untitled-${index}`}
                      </Typography>
                    </StyledButton>
                  ))}
                <IconRow onClick={() => handleDisconnect(`/${username}`)} text='Dashboard' icon={<ArrowBack />} />
              </Box>
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};
export default ClientDrawer;
