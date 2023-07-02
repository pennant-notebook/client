import { Box, IconButton, Typography, Stack } from '@mui/material';
import { PlayCircleOutlineTwoTone } from '@mui/icons-material';
import logo from '../../assets/logo.png';

const Header = ({ runAllCode, canRun }) => {
  return (
    <Stack direction='row' sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'left', flex: '1' }}>
        <img src={logo} width='48px' />
        <Typography variant='overline' sx={{ fontSize: '1.5rem', ml: '0.5rem' }}>
          Pennant
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: '1' }}>
        <IconButton
          onClick={runAllCode}
          sx={{ color: 'steelblue', '&:hover': { color: 'dodgerblue' } }}
          disabled={canRun}>
          <PlayCircleOutlineTwoTone sx={{ fontSize: '48px' }} />
        </IconButton>
      </Box>
    </Stack>
  );
};
export default Header;
