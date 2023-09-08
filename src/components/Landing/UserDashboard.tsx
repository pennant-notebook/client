import { useQuery } from 'react-query';
import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box, TextField, Button, Grid, Typography, useTheme } from '../../utils/MuiImports';
import LoadingSpinner from '../UI/LoadingSpinner';
import Navbar from '../Notebook/Navbar';
import { createDoc } from '../../services/dynamoPost';
import { fetchNotebooks } from '../../services/dynamoFetch';
import DashboardNotebook from './DashboardNotebook';
import styles from './UserDashboard.module.css';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { authState } from '../Auth/authState';

interface Notebook {
  docID: string;
  title?: string;
}

interface UserDashboardContentProps {
  username: string;
  notebooks?: Notebook[];
  refetch: () => void;
}

export const UserDashboardContent = ({ username, notebooks, refetch }: UserDashboardContentProps) => {
  document.title = 'Board | ' + username;
  const [searchTerm, setSearchTerm] = useState<string>('');

  const navigate = useNavigate();
  const theme = useTheme();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      <Navbar isDashboard={true} />
      <Box className={`${styles.userDashboard} ${styles[theme.palette.mode]}`} sx={{ fontFamily: 'Lato' }}>
        <TextField
          autoComplete='off'
          value={searchTerm}
          onChange={handleSearchChange}
          label='Search Notebooks'
          variant='outlined'
          sx={{ width: '50%', fontFamily: 'Lato' }}
        />
        <Box display='flex' justifyContent='center' alignItems='center' padding='10px 20px'>
          <Button variant='contained' color='primary' onClick={handleCreateNotebook} sx={{ fontFamily: 'Lato' }}>
            New
          </Button>
        </Box>
      </Box>

      {!filteredNotebooks || filteredNotebooks.length === 0 ? (
        <Box display='flex' justifyContent='center' alignItems='center' padding='20px 20px'>
          <Typography variant='h5' sx={{ fontFamily: 'Lato', opacity: '0.6', mt: '10px' }}>
            Nothing to see here yet...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={5} justifyContent='center' sx={{ width: '80%', margin: 'auto', padding: '20px 0' }}>
          {filteredNotebooks.length > 0 &&
            filteredNotebooks.map((notebook, index) => (
              <Grid item key={notebook.docID} xs={12} sm={6} md={4}>
                <DashboardNotebook
                  docID={notebook.docID}
                  title={notebook.title || ''}
                  index={index}
                  refetch={refetch}
                />
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export const UserDashboard = () => {
  const { username } = useParams<{ username: string | '' }>();
  const {
    data,
    refetch,
    isLoading: loading,
    isError: error
  } = useQuery<Notebook[], Error>(['notebooks', username], () => fetchNotebooks(username!), {
    refetchOnWindowFocus: false
  });

  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const usernameFromLocal = localStorage.getItem('pennant-username');
  const authToken = localStorage.getItem('pennantAccessToken');

  if (!username) return null;
  const authUsername = auth.userData?.login;
  console.log(usernameFromLocal, authUsername, username.slice(1));

  useEffect(() => {
    if (username === '@trypennant') return;
    if (!authToken || usernameFromLocal !== username.slice(1)) {
      const errorMsg = authToken ? 'You are not authorized to view this page.' : 'Please login to view this page.';
      toast.error(errorMsg);
      navigate('/auth');
    }
  }, [username]);

  if (loading) return <LoadingSpinner />;
  if (error) return 'Error!';

  return <UserDashboardContent username={username} notebooks={data} refetch={refetch} />;
};

export default UserDashboard;
