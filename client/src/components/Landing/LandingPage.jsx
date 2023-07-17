import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, Button } from '../../utils/MuiImports';
import { createDocInDynamo } from '../../services/dynamo';

const LandingPage = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleEnter = async () => {
    try {
      const data = await createDocInDynamo('@' + username);
      // console.log(data.username);
      navigate(`/@${data.username}`);
    } catch (error) {
      console.error('Error finding or creating user: ', error);
    }
  };

  const handleTry = async () => {
    try {
      const notebookData = await createDocInDynamo('@trypennant');
      // console.log(notebookData);
      navigate(`/@trypennant/${notebookData.docID}`);
    } catch (error) {
      console.error('Error creating @trypennant notebook: ', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        backgroundColor: '#f5f5f5',
        paddingBottom: '20vh'
      }}>
      <Typography variant='h2' sx={{ marginBottom: 3 }}>
        Welcome to Pennant
      </Typography>
      <TextField
        variant='outlined'
        value={username}
        onChange={e => setUsername(e.target.value)}
        label='Enter your username'
        onKeyDown={e => {
          if (e.key === 'Enter') handleEnter();
        }}
        sx={{ marginBottom: 2, width: '35vw' }}
      />
      <Button variant='contained' color='primary' onClick={handleTry} sx={{ marginTop: 2 }}>
        Try Pennant
      </Button>
    </Box>
  );
};

export default LandingPage;
