import logo from '../../assets/pen-navlogo.png';
import { AppBar, Toolbar, IconButton, Box, Typography, Stack } from '../../utils/MuiImports';
import { useNavigate, useParams } from 'react-router';
import DocTitle from './DocTitle';
import Clients from '../UI/Awareness/Clients';
import DreddButtons from './DreddButtons';
import { updateDisconnectedClient } from '../../utils/awarenessHelpers';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Navbar = ({ codeCells, clients, provider, setClients, hideClients }) => {
  const { username, docID } = useParams();
  const [show, setShow] = useState(true);

  const navigate = useNavigate();

  const handleDisconnect = destination => {
    if (docID) {
      const currentClients = updateDisconnectedClient(provider);
      setClients(currentClients);
      // console.log(currentClients.length);
    }
    navigate(destination);
  };

  return (
    <AppBar position='sticky' sx={{ backgroundColor: '#34568B' }}>
      <Toolbar
        sx={{
          width: { sm: '91%', md: '97%', lg: '95%', xl: '96%' },
          justifyContent: 'space-between',
          mx: 'auto'
        }}>
        <Toolbar id='logo-clients' sx={{ textAlign: 'left' }}>
          <Box sx={{ minWidth: '60px', ml: { xs: '-20px', sm: '-42px', md: '-36px', lg: '-40px' } }}>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='logo'
              onClick={() => handleDisconnect(`/`)}
              sx={{ p: '10px 8px' }}>
              <img src={logo} width='64px' />
            </IconButton>
          </Box>

          {docID && (
            <Box id='CLIENTS' sx={{ ml: '6px' }}>
              <IconButton onClick={() => setShow(!show)} sx={{ color: '#adb4e4' }}>
                {show ? <VisibilityIcon fontSize='small' /> : <VisibilityOffIcon fontSize='small' />}
                <Typography variant='body1' sx={{ ml: 1, color: 'inherit' }}>
                  {`${clients && clients.length} Clients`}
                </Typography>
              </IconButton>
            </Box>
          )}
          {!hideClients && <Clients clients={clients} show={show} />}
        </Toolbar>
        <Box flexGrow={1} /> {/* Spacer */}
        <Box id='TITLE'>{docID && <DocTitle />}</Box>
        <Box flexGrow={1} /> {/* Spacer */}
        <Stack id='DREDD-BUTTONS' direction='row' spacing={0}>
          <Box>{docID && <DreddButtons codeCells={codeCells} />}</Box>
          <IconButton
            onClick={() => handleDisconnect(`/${username}`)}
            sx={{ color: '#adb4e4' }}
            disabled={!docID || !provider}>
            <Typography variant='body1' sx={{ marginLeft: 1, color: docID ? '#adb4e4' : 'lightgray' }}>
              {username}
            </Typography>
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
