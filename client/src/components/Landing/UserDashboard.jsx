import { useQuery } from 'react-query';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box, TextField, Button, Grid, Card, Typography } from '../../utils/MuiImports';
import LoadingSpinner from '../UI/LoadingSpinner';
import Navbar from '../Notebook/Navbar';
import { createDoc } from '../../services/dynamoPost';
import { fetchNotebooks } from '../../services/dynamoFetch';
import { useTheme } from '@emotion/react';

export const UserDashboardContent = ({ username, notebooks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  document.title = 'Dashboard | ' + username;

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const filteredNotebooks =
    notebooks && searchTerm
      ? notebooks.filter(notebook => notebook.title?.toLowerCase().includes(searchTerm.toLowerCase()))
      : notebooks;

  const handleCreateNotebook = async () => {
    const newNotebook = await createDoc(username);
    const docID = newNotebook.docID;
    navigate(`/${username}/${docID}`);
  };

  console.log(theme);

  return (
    <Box>
      <Navbar hideClients={true} title='Notebooks' />
      <Box className={`user-dashboard ${theme.palette.mode}`}>
        <TextField
          autoComplete='off'
          value={searchTerm}
          onChange={handleSearchChange}
          label='Search Notebooks'
          variant='outlined'
          sx={{ width: '50%' }}
        />
        <Box display='flex' justifyContent='center' alignItems='center' padding='10px 20px'>
          <Button variant='contained' color='primary' onClick={handleCreateNotebook}>
            New
          </Button>
        </Box>
      </Box>

      {!filteredNotebooks || filteredNotebooks.length === 0 ? (
        <Box display='flex' justifyContent='center' alignItems='center' padding='20px 20px'>
          <Typography variant='h5' sx={{ fontFamily: 'Lato', opacity: '0.8', fontStyle: 'italic' }}>
            Nothing to see here yet...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={5} justifyContent='center' sx={{ width: '80%', margin: 'auto', padding: '20px 0' }}>
          {filteredNotebooks.length > 0 &&
            filteredNotebooks.map((notebook, index) => (
              <Grid item key={notebook.docID} xs={12} sm={6} md={4}>
                <Card
                  className={`button-4 ${theme.palette.mode}`}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  onClick={() => navigate(`/${username}/${notebook.docID}`)}>
                  <Typography className='card-title'>{notebook.title || 'untitled-' + (index + 1)}</Typography>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export const UserDashboard = () => {
  const { username } = useParams();
  const { data, loading, error } = useQuery(['notebooks', username], () => fetchNotebooks(username));

  if (loading) return <LoadingSpinner />;
  if (error) return 'Error!';

  return <UserDashboardContent username={username} notebooks={data} />;
};

export default UserDashboard;
