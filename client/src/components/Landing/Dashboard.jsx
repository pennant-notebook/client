import { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Card, Typography, Add } from '../../utils/MuiImports';
import Navbar from '../Notebook/Navbar';
import { createDocInDynamo, fetchUserFromDynamo } from '../../services/dynamo';
import { useNavigate, useParams } from 'react-router';
import { slugify } from '../../utils/notebookHelpers';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notebooks, setNotebooks] = useState([]);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserNotebooks() {
      const userbooks = await fetchUserFromDynamo(username);
      setNotebooks(userbooks);
      console.log(userbooks);
    }
    if (username) fetchUserNotebooks();
  }, [username]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const filteredNotebooks =
    notebooks && searchTerm
      ? notebooks.filter(notebook => notebook.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : notebooks;

  const handleCreateNotebook = async () => {
    const newNotebook = await createDocInDynamo(username);
    const docID = newNotebook.docID;
    navigate(`/${username}/${docID}`);
  };

  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60px',
          backgroundColor: '#F9F6EE',
          padding: '10px 20px'
        }}>
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
        <Box display='flex' justifyContent='center' alignItems='center' padding='10px 20px'>
          <Typography variant='h5'>No notebooks</Typography>
        </Box>
      ) : (
        <Grid container spacing={5} justifyContent='center' style={{ width: '80%', margin: 'auto', padding: '20px 0' }}>
          {filteredNotebooks?.map((notebook, index) => (
            <Grid item key={notebook.docID} xs={12} sm={6} md={4}>
              <Card
                className='button-4'
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onClick={() => navigate(`/${username}/${slugify(notebook.title)}`)}>
                <Typography
                  sx={{
                    fontFamily: 'Lato Code',
                    fontSize: '20px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    color: '#283655'
                  }}>
                  {notebook.title}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
