import { memo } from 'react';
import Avatar from 'react-avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Client = memo(({ username = '', color = '' }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar name={username} size={50} round='14px' color={color} />
      <Typography>{username}</Typography>
    </Box>
  );
});

export default Client;
