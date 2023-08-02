import bigLogo from '../../assets/pennant-color.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, Button, Grid, IconButton, Stack } from '../../utils/MuiImports';
import { createDoc, createUser } from '../../services/dynamoPost';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const LandingPage = () => {
  const [username, setUsername] = useState('');
  const [showTextField, setShowTextField] = useState(false);
  const navigate = useNavigate();
  document.title = 'Pennant';

  const handleEnter = async e => {
    e.preventDefault();
    try {
      const data = await createUser(username);
      navigate(`/@${data.username}`);
    } catch (error) {
      console.error('Error finding or creating user: ', error);
    }
  };

  return (
    <Box
      className='landing'
      sx={{
        textAlign: 'center',
        height: '100vh',
        backgroundColor: '#282c34',
        paddingTop: '10%'
      }}>
      <img src={bigLogo} alt='logo' style={{ marginBottom: '3vh', width: '30%' }} />
      <Typography variant='h2' sx={{ marginBottom: 4, color: '#fff', fontFamily: 'Fira Code' }}>
        Welcome to Pennant
      </Typography>

      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { width: '45ch' },
          '& .MuiButton-root': { width: '45ch' }
        }}
        noValidate
        autoComplete='off'>
        <Stack spacing={2.5} justifyContent='center' alignItems='center'>
          <Stack direction='row' spacing={2} sx={{ ml: showTextField ? 8 : 0 }}>
            {showTextField ? (
              <Stack direction='row' sx={{ alignItems: 'center' }}>
                <TextField
                  fullWidth
                  variant='outlined'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  label='Enter workspace name'
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleEnter(e);
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#fff',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: '#ddd',
                        borderWidth: '2px'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ddd',
                        borderWidth: '2px'
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                      fontSize: '1.35rem'
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ddd',
                      fontSize: '1.2rem'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#ddd'
                    },
                    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -8px) scale(0.64)'
                    }
                  }}
                />
                <IconButton
                  onClick={handleEnter}
                  sx={{
                    backgroundColor: '#ff9800',
                    color: '#fff',
                    ml: 2,
                    '&:hover': { backgroundColor: '#ffad33' }
                  }}>
                  <ArrowRightAltIcon fontSize='large' />
                </IconButton>
              </Stack>
            ) : (
              <Button variant='contained' onClick={() => setShowTextField(true)} className='workspace-button'>
                Join or Create Workspace
              </Button>
            )}
          </Stack>
          <Button variant='contained' onClick={() => navigate(`/@trypennant`)} className='explore-button'>
            Explore Demo Notebook
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LandingPage;
