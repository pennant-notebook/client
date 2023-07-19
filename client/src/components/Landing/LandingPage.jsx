import bigLogo from '../../assets/pen-navlogo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, Button, Grid } from '../../utils/MuiImports';
import { createDocInDynamo, createUserInDynamo } from '../../services/dynamo';

const LandingPage = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleEnter = async () => {
    try {
      const data = await createUserInDynamo(username);
      navigate(`/@${data.username}`);
    } catch (error) {
      console.error('Error finding or creating user: ', error);
    }
  };

  const handleTry = async () => {
    try {
      const notebookData = await createDocInDynamo('@trypennant');
      navigate(`/@trypennant/${notebookData.docID}`);
    } catch (error) {
      console.error('Error creating @trypennant notebook: ', error);
    }
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        height: '75vh',
        paddingY: '25vh',
        backgroundColor: 'rgb(35, 70, 89)'
      }}>
      <img src={bigLogo} alt='logo' style={{ marginBottom: '3vh', width: '30%' }} />
      <Typography variant='h2' sx={{ marginBottom: 3, color: '#fff' }}>
        Welcome to Pennant
      </Typography>
      <Grid container direction='row' spacing={2} justifyContent='center' alignItems='center'>
        <Grid item>
          <TextField
            variant='outlined'
            value={username}
            onChange={e => setUsername(e.target.value)}
            label='Enter your username'
            onKeyDown={e => {
              if (e.key === 'Enter') handleEnter();
            }}
            sx={{
              width: '35vw',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff'
                },
                '&:hover fieldset': {
                  borderColor: '#ddd'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ddd'
                }
              },
              '& .MuiInputBase-input': {
                color: '#fff'
              },
              '& .MuiFormLabel-root': {
                color: '#ddd'
              },
              '& .MuiFormLabel-root.Mui-focused': {
                color: '#ddd'
              }
            }}
          />
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            color='secondary'
            onClick={handleEnter}
            style={{ backgroundColor: '#ff9800', color: '#fff' }}>
            Join or Create Workspace
          </Button>
        </Grid>
      </Grid>
      <Button
        variant='contained'
        color='primary'
        onClick={handleTry}
        sx={{ marginTop: 2, backgroundColor: '#4caf50', color: '#fff' }}>
        Explore Demo Notebook
      </Button>
    </Box>
  );
};

export default LandingPage;
