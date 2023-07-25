import logo from '../../assets/pennant-color.png';
import darklogo from '../../assets/pennant-gray.png';
import { AppBar, Toolbar, IconButton, Box, Typography, Stack, useTheme } from '../../utils/MuiImports';
import { useNavigate, useParams } from 'react-router';
import DocTitle from './DocTitle';
import Clients from '../UI/Awareness/Clients';
import DreddButtons from './DreddButtons';
import { updateDisconnectedClient } from '../../utils/awarenessHelpers';
import { useState } from 'react';
import ClientDrawer from '../UI/Awareness/ClientDrawer';
import { Visibility, VisibilityOff } from '../../utils/MuiImports';

const Navbar = ({ codeCells, clients, provider, setClients, hideClients }) => {
  const { username, docID } = useParams();
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const {
    custom: { currTheme, toggleTheme }
  } = useTheme();

  const handleDisconnect = destination => {
    if (docID) {
      const currentClients = updateDisconnectedClient(provider);
      setClients(currentClients);
    }
    navigate(destination);
  };

  console.log(currTheme);

  return (
    <AppBar position='sticky' sx={{ backgroundColor: '#34568B' }}>
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
            <IconButton
              edge='start'
              color='inherit'
              aria-label='logo'
              onClick={() => handleDisconnect(`/`)}
              sx={{ py: 1, borderRadius: '2px' }}>
              <img src={currTheme === 'dark' ? darklogo : logo} width='56px' />
            </IconButton>
          </Box>

          {docID && (
            <Stack
              id='CLIENTS'
              sx={{ mx: { xs: 1, sm: 2, md: 3, lg: 3.5 } }}
              direction={{ xs: 'column', xm: 'row', md: 'row' }}>
              <IconButton onClick={() => setShow(!show)} sx={{ color: '#adb4e4' }}>
                {show ? <Visibility fontSize='small' /> : <VisibilityOff fontSize='small' />}
                <Typography
                  sx={{
                    ml: 2,
                    color: 'inherit',
                    fontFamily: 'Lato'
                  }}>
                  {`${clients && clients.length} client${clients.length > 1 ? 's' : ''}`}
                </Typography>
              </IconButton>
            </Stack>
          )}
          {!hideClients && <Clients clients={clients} show={show} />}
        </Box>

        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ display: 'flex', flexGrow: 1 }} />

          {docID ? <DocTitle /> : <Typography sx={{ opacity: 0.5, fontSize: '20px' }}>Notebooks</Typography>}
          <Box sx={{ display: 'flex', flexGrow: 1 }} />
        </Box>

        <Stack direction='row' spacing={{ xs: 0, sm: 1, md: 2 }} alignItems='center'>
          {docID && <DreddButtons codeCells={codeCells} />}

          <ClientDrawer handleDisconnect={handleDisconnect} />
        </Stack>

        {!docID && <Typography sx={{ fontFamily: 'Lato', opacity: '0.5' }}>{username}</Typography>}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
