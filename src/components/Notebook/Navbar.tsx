import { useNavigate, useParams } from 'react-router';
import logo from '~/assets/pennant-color.png';
import {
  AppBar,
  Box,
  Brightness4,
  Brightness7,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme
} from '~/utils/MuiImports';
import ClientDrawer from '../UI/Awareness/ClientDrawer';
import Clients from '../UI/Awareness/Clients';
import IconRow from '../UI/IconRow';
import DocTitle from './DocTitle';
import DreddButtons from './DreddButtons';
import { YMap } from '~/utils/notebookHelpers';

interface NavbarProps {
  codeCells?: YMap[];
  clients?: any[];
  isDashboard?: boolean;
  handleDisconnect?: (destination: string) => void;
}
const Navbar = ({ codeCells, clients = [], isDashboard, handleDisconnect }: NavbarProps) => {
  const { username, docID } = useParams();
  const navigate = useNavigate();
  const {
    custom: { currTheme, toggleTheme }
  } = useTheme();

  const clientCount = clients.length;
  const paddingClient =
    clientCount <= 1 ? 10 : clientCount === 2 ? 8 : clientCount === 3 ? 6 : clientCount >= 4 ? 0 : 10;

  return (
    <AppBar
      position='sticky'
      sx={{ backgroundColor: currTheme === 'dark' ? '#1e202d' : '#1D465B', fontFamily: 'Lato' }}>
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
                onClick={() => {
                  if (docID) {
                    if (handleDisconnect) {
                      handleDisconnect(`/${username}`);
                    }
                  } else {
                    navigate(`/`);
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
          {docID ? <DocTitle /> : <Typography sx={{ opacity: 0.5, fontSize: '20px' }}></Typography>}
        </Box>

        <Stack direction='row' spacing={{ xs: 0, sm: 1, md: 2 }} alignItems='center'>
          {docID && <DreddButtons codeCells={codeCells} />}

          {docID && handleDisconnect && <ClientDrawer handleDisconnect={handleDisconnect} clients={clients} />}
        </Stack>

        {!docID && <Typography sx={{ fontFamily: 'Lato', opacity: '0.5', pr: 2 }}>{username}</Typography>}
        {isDashboard && (
          <IconRow
            onClick={toggleTheme}
            icon={
              currTheme === 'dark' ? (
                <Brightness7 sx={{ color: '#e0e0e0' }} />
              ) : (
                <Brightness4 sx={{ color: '#e0e0e0' }} />
              )
            }
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
