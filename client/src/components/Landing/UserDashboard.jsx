import { useQuery } from 'react-query';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box, TextField, Button, Grid, Typography, useTheme } from '../../utils/MuiImports';
import LoadingSpinner from '../UI/LoadingSpinner';
import Navbar from '../Notebook/Navbar';
import { createDoc } from '../../services/dynamoPost';
import { fetchNotebooks } from '../../services/dynamoFetch';
import DashboardNotebook from './DashboardNotebook';

export const UserDashboardContent = ({ username, notebooks, refetch }) => {
  document.title = 'Board | ' + username;
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const theme = useTheme();

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleCreateNotebook = async () => {
    const newNotebook = await createDoc(username);
    const docID = newNotebook.docID;
    navigate(`/${username}/${docID}`);
  };

  const filteredNotebooks =
    notebooks && searchTerm
      ? notebooks.filter(notebook => notebook.title?.toLowerCase().includes(searchTerm.toLowerCase()))
      : notebooks;

  return (
    <Box>
      <Navbar hideClients={true} isDashboard={true} />
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
                <DashboardNotebook docID={notebook.docID} title={notebook.title} index={index} refetch={refetch} />
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export const UserDashboard = () => {
  const { username } = useParams();
  const { data, refetch, loading, error } = useQuery(['notebooks', username], () => fetchNotebooks(username), {
    refetchOnWindowFocus: false
  });
  if (loading) return <LoadingSpinner />;
  if (error) return 'Error!';

  return <UserDashboardContent username={username} notebooks={data} refetch={refetch} />;
};

export default UserDashboard;
