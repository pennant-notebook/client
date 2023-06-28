import { Box, Typography } from '@mui/material';

const OutputWindow = ({ outputDetails }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant='h6'>Output</Typography>
      <Box sx={{ height: 224, bgcolor: 'grey.900', color: 'white', p: 2, overflow: 'auto' }}>
        {outputDetails && <Typography variant='body2'>{outputDetails?.stdout}</Typography>}
      </Box>
    </Box>
  );
};

export default OutputWindow;
