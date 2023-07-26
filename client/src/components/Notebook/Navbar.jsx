import logo from '../../assets/pennant-color.png';
import darklogo from '../../assets/pennant-gray.png';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Stack,
  useTheme,
  Brightness7,
  Brightness4,
  Tooltip
} from '../../utils/MuiImports';
import { useNavigate, useParams } from 'react-router';
import DocTitle from './DocTitle';
import Clients from '../UI/Awareness/Clients';
import DreddButtons from './DreddButtons';
import ClientDrawer from '../UI/Awareness/ClientDrawer';
import IconRow from '../UI/IconRow';

const Navbar = ({ codeCells, clients = [], isDashboard, handleDisconnect }) => {
  const { username, docID } = useParams();
  const navigate = useNavigate();
  const {
    custom: { currTheme, toggleTheme }
  } = useTheme();

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
            <Tooltip title={docID ? '⬅ Dashboard' : '⬅ Home'} arrow>
              <IconButton
                edge='start'
                color='inherit'
                aria-label='logo'
                onClick={() => (docID ? handleDisconnect(`/${username}`) : navigate(`/`))}
                sx={{ py: 1, borderRadius: '2px' }}>
                <img src={currTheme === 'dark' ? darklogo : logo} width='56px' />
              </IconButton>
            </Tooltip>
          </Box>
          <Box id='CLIENTS' sx={{ ml: 4, pr: clientCount >= 4 ? 1.5 : 10 - clientCount }}>
            {docID && <Clients clients={clients} />}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          {docID ? <DocTitle /> : <Typography sx={{ opacity: 0.5, fontSize: '20px' }}></Typography>}
        </Box>

        <Stack direction='row' spacing={{ xs: 0, sm: 1, md: 2 }} alignItems='center'>
          {docID && <DreddButtons codeCells={codeCells} />}

          {docID && <ClientDrawer handleDisconnect={handleDisconnect} clients={clients} />}
        </Stack>

        {!docID && <Typography sx={{ fontFamily: 'Lato', opacity: '0.5', pr: 2 }}>{username}</Typography>}
        {isDashboard && (
          <IconRow
            onClick={toggleTheme}
            icon={currTheme === 'dark' ? <Brightness7 sx={{ color: '#e0e0e0' }} /> : <Brightness4 />}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
