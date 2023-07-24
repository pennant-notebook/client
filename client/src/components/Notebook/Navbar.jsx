import logo from '../../assets/pennant-color.png';
import darklogo from '../../assets/pennant-gray.png';
import { AppBar, Toolbar, IconButton, Box, Typography, Stack, useTheme } from '../../utils/MuiImports';
import { useNavigate, useParams } from 'react-router';
import DocTitle from './DocTitle';
import Clients from '../UI/Awareness/Clients';
import DreddButtons from './DreddButtons';
import { updateDisconnectedClient } from '../../utils/awarenessHelpers';
import { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Avatar from 'react-avatar';

const Navbar = ({ codeCells, clients, provider, setClients, hideClients, title }) => {
  const { username, docID } = useParams();
  const [show, setShow] = useState(true);
  const [avatar, setAvatar] = useState(null);

  const theme = useTheme();
  const logoSrc = theme.palette.mode === 'dark' ? darklogo : logo;

  const navigate = useNavigate();

  const handleDisconnect = destination => {
    if (docID) {
      const currentClients = updateDisconnectedClient(provider);
      setClients(currentClients);
    }
    navigate(destination);
  };

  useEffect(() => {
    if (clients && clients.length > 0) {
      setAvatar(clients[0]);
    }
  }, [clients]);

  const handleAvatarClick = () => {
    let newName = window.prompt('Enter a new name:');
    if (newName) {
      setAvatar(prevAvatar => ({ ...prevAvatar, name: newName }));
      provider.awareness.setLocalStateField('user', { ...avatar, name: newName, setByUser: true });
      localStorage.setItem('userData', JSON.stringify({ name: newName, color: avatar.color, setByUser: true }));
    }
  };

  return (
    <AppBar position='sticky' sx={{ backgroundColor: '#34568B' }}>
      <Toolbar
        sx={{
          width: '100%',
          justifyContent: 'space-around'
        }}>
        <Toolbar id='logo-clients' sx={{ width: { xs: '20%', sm: '15%', md: '20%', xl: '12.5%' } }}>
          <Box sx={{ minWidth: '60px', ml: { xs: '-20px', sm: '-42px', md: '-36px', lg: '-40px' } }}>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='logo'
              onClick={() => handleDisconnect(`/`)}
              sx={{ p: '10px 20px' }}>
              <img src={logoSrc} width='64px' />
            </IconButton>
          </Box>
          {docID && (
            <Box id='CLIENTS'>
              <IconButton onClick={() => setShow(!show)} sx={{ color: '#adb4e4' }}>
                {show ? <VisibilityIcon fontSize='small' /> : <VisibilityOffIcon fontSize='small' />}
                <Typography variant='body1' sx={{ ml: 1, color: 'inherit', fontFamily: 'Lato' }}>
                  {`${clients && clients.length} Clients`}
                </Typography>
              </IconButton>
            </Box>
          )}
          {!hideClients && <Clients clients={clients} show={show} />}
        </Toolbar>

        <Box id='TITLE' sx={{ width: { xs: '60%', sm: '70%', md: '60%', xl: '75%' }, mx: 'auto' }}>
          {docID && <DocTitle />}
          <Typography sx={{ opacity: 0.5, fontSize: '20px' }}>{title && title}</Typography>
        </Box>

        <Stack
          id='DREDD-BUTTONS'
          direction='row'
          spacing={0}
          sx={{ alignItems: 'center', width: { xs: '20%', sm: '15%', md: '20%', xl: '12.5%' } }}>
          <Box>{docID && <DreddButtons codeCells={codeCells} />}</Box>
          <IconButton
            onClick={() => handleDisconnect(`/${username}`)}
            sx={{ color: '#adb4e4' }}
            disabled={!docID || !provider}>
            <Typography variant='body1' sx={{ mx: 1, color: docID ? '#adb4e4' : 'lightgray', fontFamily: 'Lato' }}>
              {username}
            </Typography>
          </IconButton>

          {avatar && (
            <div className='navbar-avatar'>
              <Avatar name={avatar.name} size={32} round='30px' color={avatar.color} onClick={handleAvatarClick} />
            </div>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
