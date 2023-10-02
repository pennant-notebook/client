// import { useQuery } from 'react-query';
// import { useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router';
// import { Box, Typography } from '~/utils/MuiImports';
// import LoadingSpinner from '~/components/UI/loading/LoadingSpinner';
// import Navbar from '~/components/Notebook/navbar/Navbar';
// import { fetchNotebooks } from '~/services/dynamoFetch';
// import { toast } from 'react-toastify';
// import { NotebookType } from '@/NotebookTypes';
// import LeftSidebar from '~/components/Dashboard/tree/LeftSidebar';

// interface UserDashboardContentProps {
//   username: string;
//   notebooks?: NotebookType[];
//   refetch: () => void;
// }

// export const UserDashboardContent = ({ username, notebooks, refetch }: UserDashboardContentProps) => {
//   document.title = 'Workspace | ' + username;

//   return (
//     <Box>
//       <Navbar isDashboard={true} />
//       <LeftSidebar username={username} notebooks={notebooks} refetch={refetch} />
//       {!notebooks ||
//         (notebooks.length === 0 && (
//           <Box display='flex' justifyContent='center' alignItems='center' padding='20px 20px' marginLeft={8}>
//             <Typography variant='h5' sx={{ fontFamily: 'Lato', opacity: '0.6', mt: '10px' }}>
//               Nothing to see here yet...
//             </Typography>
//           </Box>
//         ))}
//     </Box>
//   );
// };

// export const UserDashboard = () => {
//   const { username } = useParams<{ username: string | '' }>();
//   const {
//     data,
//     refetch,
//     isLoading: loading,
//     isError: error
//   } = useQuery<NotebookType[], Error>(['notebooks', username], () => fetchNotebooks(username!), {
//     refetchOnWindowFocus: false
//   });

//   const navigate = useNavigate();
//   const usernameFromLocal = localStorage.getItem('pennant-username');
//   const authToken = localStorage.getItem('pennantAccessToken');

//   if (!username) return null;

//   useEffect(() => {
//     if (username === '@trypennant') return;
//     if (!authToken || usernameFromLocal !== username.slice(1)) {
//       const errorMsg = authToken ? 'You are not authorized to view this page.' : 'Please login to view this page.';
//       toast.error(errorMsg);
//       navigate('/auth');
//     }
//   }, [username]);

//   if (loading) return <LoadingSpinner />;
//   if (error) return 'Error!';

//   return <UserDashboardContent username={username} notebooks={data} refetch={refetch} />;
// };

// export default UserDashboard;
