import logo from '../../assets/logo.png';
import { Box, IconButton, Typography, Stack } from '@mui/material';
import { PlayCircleOutlineTwoTone, Refresh } from '@mui/icons-material';
import { checkDreddStatus, sendManyToDredd, resetContext } from '../../services/dreddExecutionService';
import useProviderContext from '../../contexts/ProviderContext';

const Header = ({ roomID, codeCells }) => {
  const { doc } = useProviderContext();

  // handleRunAllCode not working currently - pending API fix to include cellIds in response
  const handleRunAllCode = async () => {
    const token = await sendManyToDredd(roomID, codeCells);
    const response = await checkDreddStatus(token);

    response.forEach(codeCell => {
      const cell = doc
        .getArray('cells')
        .toArray()
        .find(c => c.get('id') === codeCell['id']);
      if (cell && codeCell.output) {
        const outputMap = cell.get('outputMap');
        outputMap.set('stdout', codeCell.output);
      }
    });
  };

  const handleResetContext = async () => {
    await resetContext(roomID);
  };

  return (
    <Stack direction='row' sx={{ width: '90%', margin: '10px auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'left', flex: '1' }}>
        {/* <img src={logo} width='48px' /> */}
        <Typography sx={{ fontSize: '40px' }}>🏴‍☠️</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: '1' }}>
        <IconButton onClick={handleResetContext} sx={{ color: 'steelblue', '&:hover': { color: 'dodgerblue' } }}>
          <Refresh sx={{ fontSize: '48px' }} />
        </IconButton>
        <IconButton onClick={handleRunAllCode} sx={{ color: 'steelblue', '&:hover': { color: 'dodgerblue' } }}>
          <PlayCircleOutlineTwoTone sx={{ fontSize: '48px' }} />
        </IconButton>
      </Box>
    </Stack>
  );
};
export default Header;
