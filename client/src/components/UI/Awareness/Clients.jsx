import Avatar from 'react-avatar';
import { Box, Tooltip } from '../../../utils/MuiImports';

const Clients = ({ clients }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
      {clients.length > 3 && (
        <Tooltip title={`${clients.length - 3} more clients`} arrow>
          <Box sx={{ marginLeft: '-15px' }}>
            <Avatar value={`+${clients.length - 3}`} size={32} round='30px' textSizeRatio={2.5} color='lightgray' />
          </Box>
        </Tooltip>
      )}
      {clients.slice(1, 4).map((client, index) => (
        <Tooltip key={client.id} title={client.name} arrow>
          <Box sx={{ marginLeft: '-15px ' }}>
            <Avatar name={client.name} size={32} round='30px' color={client.color} />
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
};

export default Clients;
