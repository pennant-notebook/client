import logo from '../../assets/pen-navlogo.png';
import { AppBar, Toolbar, IconButton, Box, Typography, Stack } from '../../utils/MuiImports';
import { Button } from '../../utils/MuiImports';
import { useNavigate, useParams } from 'react-router';
import DocTitle from './DocTitle';
import Clients from '../UI/Awareness/Clients';
import DreddButtons from './DreddButtons';
import { updateClients } from '../../utils/awarenessHelpers';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// Navbar in: UserRoute, Dashboard and Notebook.jsx
const Navbar = ({ codeCells, clients, provider, setClients, hideClients }) => {
  const { username, docID } = useParams();
  const [show, setShow] = useState(true);

  const navigate = useNavigate();

  const handleClientDisconnect = () => {
    const currentClients = updateClients(provider);
    setClients(currentClients);
    console.log(currentClients.length);
    navigate(`/${username}`);
  };

  return (
    <AppBar position='sticky' sx={{ backgroundColor: '#34568B' }}>
      <Toolbar sx={{ width: '97%', justifyContent: 'space-between' }}>
        <Toolbar id='logo-clients' sx={{ textAlign: 'left' }}>
          <IconButton edge='start' color='inherit' aria-label='logo' onClick={() => navigate(`/`)} sx={{ ml: '-32px' }}>
            <img src={logo} width='64px' />
          </IconButton>

          <Box id='CLIENTS' sx={{ ml: '10px' }}>
            <IconButton onClick={() => setShow(!show)} sx={{ color: '#adb4e4' }}>
              {show ? <VisibilityIcon fontSize='small' /> : <VisibilityOffIcon fontSize='small' />}
              <Typography variant='body1' sx={{ ml: 1, color: 'inherit' }}>
                {`${clients && clients.length} Clients`}
              </Typography>
            </IconButton>
          </Box>
          {!hideClients && <Clients clients={clients} show={show} />}
        </Toolbar>

        <Box id='TITLE'>{docID && <DocTitle />}</Box>

        <Stack id='DREDD-BUTTONS' direction='row' spacing={0}>
          <Box>{docID && <DreddButtons codeCells={codeCells} />}</Box>
          <IconButton onClick={handleClientDisconnect} sx={{ color: '#adb4e4' }} disabled={!docID || !provider}>
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
