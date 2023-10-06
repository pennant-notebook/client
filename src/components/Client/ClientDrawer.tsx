import { ClientType } from '@/ClientTypes';
import { useCallback, useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { useNavigate, useParams } from 'react-router';
import useProviderContext from '~/contexts/ProviderContext';
import {
  ArrowBack,
  Box,
  Brightness4,
  Brightness7,
  Divider,
  Drawer,
  Edit,
  IconButton,
  Stack,
  Typography,
  useTheme,
  AccountCircle
} from '~/utils/MuiImports';
import { getClientFromLocalStorage } from '~/utils/awarenessHelpers';
import IconRow from '~/components/UI/IconRow';
import styles from './Clients.module.css';
import ThemeSelector from '~/components/UI/ThemeSelector';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authState, selectedDocIdState } from '~/appState';
import LoginSvg from '~/assets/auth/login.svg';
import LogoutSvg from '~/assets/auth/logout.svg';

interface ClientDrawerProps {
  handleDisconnect: (destination: string) => void;
  clients?: ClientType[];
}

const ClientDrawer = ({ handleDisconnect, clients = [] }: ClientDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useRecoilState(authState);
  const { docID } = useParams();
  const [avatar, setAvatar] = useState(clients[0]);
  const providerContext = useProviderContext();
  const provider = providerContext ? providerContext.provider : null;
  const setSelectedDocId = useSetRecoilState(selectedDocIdState);
  const navigate = useNavigate();

  const {
    custom: { toggleTheme }
  } = useTheme();

  const currTheme = useTheme().palette.mode;

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

  useEffect(() => {
    if (clients && clients.length > 0) {
      setAvatar(clients[0]);
    } else {
      const storedClient: ClientType = getClientFromLocalStorage();
      setAvatar(storedClient);
    }
  }, [clients]);

  const handleClickToGoBack = () => {
    if (auth.isLoggedIn) {
      setSelectedDocId(null);
      handleDisconnect(`/@${auth.userData?.login}`);
    } else {
      setSelectedDocId(null);
      handleDisconnect('/');
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const pennantAccessToken = localStorage.getItem('pennantAccessToken');
      const username = localStorage.getItem('pennant-username');
      setAuth({
        isLoggedIn: !!pennantAccessToken,
        userData: { login: username || '' },
        provider: null
      });
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('pennantAuthData');
    localStorage.removeItem('pennant-username');
    setAuth({ isLoggedIn: false, userData: null, provider: null });
    if (!docID) {
      setSelectedDocId(null);
      handleDisconnect('/');
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
    setAuth({ isLoggedIn: true, userData: auth.userData, provider: auth.provider });
  };

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
              <Divider sx={{ my: 2 }} />

              <IconRow
                onClick={handleClickToGoBack}
                text={!docID && !auth.isLoggedIn ? 'Home' : auth.isLoggedIn ? auth.userData?.login : 'Home'}
                icon={auth.isLoggedIn ? <AccountCircle /> : <ArrowBack />}
              />
              <IconRow
                onClick={auth.isLoggedIn ? handleSignOut : handleSignIn}
                text={auth.isLoggedIn ? 'Logout' : 'Login'}
                icon={
                  <img
                    src={auth.isLoggedIn ? LogoutSvg : LoginSvg}
                    width='18'
                    style={{ marginLeft: 4.5, marginRight: 0.5 }}
                  />
                }
              />
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};
export default ClientDrawer;
