import { Box, Typography } from '@mui/material';

const OutputDetails = ({ outputDetails }) => {
  return (
    <Box>
      <Typography variant='body2'>
        CPU Time:
        <Box component='span' fontWeight='bold' px={1}>
          {outputDetails?.time}
        </Box>
      </Typography>
      <Typography variant='body2'>
        Memory:
        <Box component='span' fontWeight='bold' px={1}>
          {outputDetails?.memory}
        </Box>
      </Typography>
    </Box>
  );
};

export default OutputDetails;
