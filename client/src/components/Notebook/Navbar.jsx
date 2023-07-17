import logo from '../../assets/agora3.png';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '../../utils/MuiImports';
import { useNavigate, useParams } from 'react-router';
import EditTitle from './EditTitle';

const Navbar = () => {
  const { username, docID } = useParams();
  const navigate = useNavigate();

  return (
    <AppBar position='sticky' sx={{ backgroundColor: '#34568B' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <IconButton edge='start' color='inherit' aria-label='logo' onClick={() => navigate(`/`)}>
          <img src={logo} width='48px' />
        </IconButton>
        {docID && <EditTitle />}
        <button onClick={() => navigate(`/${username}`)} className='button-4'>
          {username}
        </button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
