import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { authState, notebookLanguageState, selectedDocIdState } from '~/appState';
import LoggedInIcon from '~/assets/auth/loggedIn.svg';
import logo from '~/assets/logo/pennant-color.png';
import ClientDrawer from '~/components/Client/ClientDrawer';
import Clients from '~/components/Client/Clients';
import IconRow from '~/components/UI/IconRow';
import { useNavbarContext } from '~/contexts/NavbarContext';
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme
} from '~/utils/MuiImports';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

import DocTitle from './DocTitle';
import DreddButtons from './actions/DreddButtons';

interface NavbarProps {
  selectedDoc?: string;
}

const Navbar = ({ selectedDoc }: NavbarProps) => {
  const navigate = useNavigate();
  const { username, docID: paramsDoc } = useParams();
  const { codeCells, clients, handleDisconnect } = useNavbarContext();
  const setSelectedDocId = useSetRecoilState(selectedDocIdState);
  const notebookLanguage = useRecoilValue(notebookLanguageState);
  const docID = selectedDoc || paramsDoc;
  const [anchorEl, setAnchorEl] = useState(null);
  const [auth, setAuth] = useRecoilState(authState);

  const currTheme = useTheme().palette.mode;
  const {
    custom: { toggleTheme }
  } = useTheme();

  const clientCount = clients.length;
  const paddingClient =
    clientCount <= 1 ? 10 : clientCount === 2 ? 8 : clientCount === 3 ? 6 : clientCount >= 4 ? 0 : 10;

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('pennantAccessToken');
    localStorage.removeItem('pennantAuthData');
    localStorage.removeItem('pennant-username');
    setAuth({
      isLoggedIn: false,
      userData: null,
      provider: null
    });

    navigate('/');
  };

  return (
    <AppBar
      position='sticky'
      sx={{
        backgroundColor: currTheme === 'dark' ? '#000' : '#234659',
        borderBottom: currTheme === 'dark' ? '1px solid #313121' : 'none'
      }}>
      <Toolbar
        sx={{
          width: '100%',
          justifyContent: 'space-between'
        }}>
        <Box id='logo-clients' sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              alignItems: 'center'
            }}>
            <Tooltip title={paramsDoc ? '⬅ Dashboard' : 'Toggle Sidebar'} enterDelay={2000} enterNextDelay={5000} arrow>
              <IconButton
                edge='start'
                color='inherit'
                aria-label='logo'
                onClick={() => {
                  if (handleDisconnect) {
                    handleDisconnect(`/`);
                    setSelectedDocId(null);
                  }
                }}
                sx={{ py: 1, borderRadius: '2px' }}>
                <img src={logo} width='56px' />
              </IconButton>
            </Tooltip>
          </Box>

          <Box id='CLIENTS' sx={{ ml: 4, pr: paddingClient }}>
            {docID && <Clients clients={clients} />}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          {docID ? (
            <DocTitle selectedDoc={docID} language={notebookLanguage!} />
          ) : (
            <Typography sx={{ opacity: 0.5, fontSize: '20px' }}></Typography>
          )}
        </Box>
        <Stack direction='row' spacing={{ xs: 0, sm: 1, md: 2 }} alignItems='center'>
          {docID && <DreddButtons codeCells={codeCells} />}

          {docID && handleDisconnect && <ClientDrawer handleDisconnect={handleDisconnect} clients={clients} />}
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!docID && (
            <>
              <IconButton onClick={handleMenu} size='large' sx={{ ml: 2 }}>
                <img
                  style={{ borderRadius: '50%', width: '32px', height: '32px', marginRight: '10px' }}
                  src={auth.userData?.avatar_url || auth.userData?.avatar || LoggedInIcon}
                  alt="User's avatar"
                  onError={e => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.onerror = null;
                    imgElement.src = LoggedInIcon;
                  }}
                />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={handleClose}>{username}</MenuItem>
                {/* <MenuItem onClick={handleClose} disabled>
                  Settings
                </MenuItem> */}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
          {!docID && (
            <IconRow
              onClick={toggleTheme}
              icon={
                currTheme === 'dark' ? (
                  <BulbOutlined style={{ color: '#e0e0e0', width: '20px' }} />
                ) : (
                  <BulbFilled style={{ color: 'lightgray', width: '20px' }} />
                )
              }
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
