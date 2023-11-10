import Avatar from 'react-avatar';
import { Box, Stack } from '~/utils/MuiImports';
import { AwarenessUserState } from '@/ClientTypes';

type ClientsProps = {
  clients: AwarenessUserState[];
};

const Clients = ({ clients }: ClientsProps) => {
  return (
    <Stack direction='row' spacing={-0.7} className='navbar-userAvatar'>
      {clients.length > 3 && (
        <Box>
          <Avatar value={`+${clients.length - 3}`} size='30' round='30px' textSizeRatio={2.5} color='lightgray' />
        </Box>
      )}
      {clients.slice(1, 4).map((client, index) => (
        <Box key={index}>
          <Avatar
            name={client.user?.name}
            src={client.user?.avatar_url}
            color={client.user?.color}
            size='30'
            round='30px'
          />
        </Box>
      ))}
    </Stack>
  );
};

export default Clients;
