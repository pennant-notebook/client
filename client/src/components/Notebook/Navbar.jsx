import logo from '../../assets/pennant-color.png';
import darklogo from '../../assets/pennant-gray.png';
import { AppBar, Toolbar, IconButton, Box, Typography, Stack, useTheme } from '../../utils/MuiImports';
import { useNavigate, useParams } from 'react-router';
import DocTitle from './DocTitle';
import Clients from '../UI/Awareness/Clients';
import DreddButtons from './DreddButtons';
import { updateDisconnectedClient } from '../../utils/awarenessHelpers';
import ClientDrawer from '../UI/Awareness/ClientDrawer';

const Navbar = ({ codeCells, provider, clients = [], setClients }) => {
  const { username, docID } = useParams();
  const navigate = useNavigate();
  const {
    custom: { currTheme }
  } = useTheme();

  const handleDisconnect = destination => {
    if (docID) {
      const currentClients = updateDisconnectedClient(provider);
      setClients(currentClients);
    }
    navigate(destination);
  };

  const clientCount = clients.length;
  return (
    <AppBar position='sticky' sx={{ backgroundColor: currTheme === 'dark' ? '#1e202d' : '#34568B' }}>
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
          <Box id='CLIENTS' sx={{ ml: 4, pr: clientCount >= 4 ? 1.5 : 10 - clientCount }}>
            {docID && <Clients clients={clients} />}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          {docID ? <DocTitle /> : <Typography sx={{ opacity: 0.5, fontSize: '20px' }}>Notebooks</Typography>}
        </Box>

        <Stack direction='row' spacing={{ xs: 0, sm: 1, md: 2 }} alignItems='center'>
          {docID && <DreddButtons codeCells={codeCells} />}

          {docID && <ClientDrawer handleDisconnect={handleDisconnect} clients={clients} />}
        </Stack>

        {!docID && <Typography sx={{ fontFamily: 'Lato', opacity: '0.5' }}>{username}</Typography>}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
