import logo from '../../assets/pen-navlogo.png';
import { AppBar, Toolbar, IconButton, Box, Typography, Stack } from '../../utils/MuiImports';
import { useNavigate, useParams } from 'react-router';
import DocTitle from './DocTitle';
import Clients from '../UI/Awareness/Clients';
import DreddButtons from './DreddButtons';
import { updateClients } from '../../utils/awarenessHelpers';

// Navbar in: UserRoute, Dashboard and Notebook.jsx
const Navbar = ({ codeCells, clients, provider, setClients }) => {
  const { username, docID } = useParams();
  const navigate = useNavigate();

  const handleClientDisconnect = () => {
    const currentClients = updateClients(provider);
    setClients(clients.slice(1));
    navigate(`/${username}`);
  };

  return (
    <AppBar position='sticky' sx={{ backgroundColor: '#34568B' }}>
      <Toolbar sx={{ width: '97%', justifyContent: 'space-between' }}>
        <Toolbar id='logo-clients' sx={{ textAlign: 'left' }}>
          <IconButton edge='start' color='inherit' aria-label='logo' onClick={() => navigate(`/`)}>
            <img src={logo} width='64px' />
          </IconButton>
          {clients && <Clients clients={clients} />}
        </Toolbar>
        <Box id='doc-title'>{docID && <DocTitle />}</Box>

        <Stack id='action-buttons' direction='row' spacing={0}>
          <Box>{docID && <DreddButtons codeCells={codeCells} />}</Box>
          <IconButton onClick={handleClientDisconnect} color='inherit' disabled={!docID || !provider}>
            <Typography variant='body1' sx={{ marginLeft: 1 }}>
              {username}
            </Typography>
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
