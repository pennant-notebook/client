import Avatar from 'react-avatar';
import { Box, Stack } from '~/utils/MuiImports';
import { ClientType } from '@/ClientTypes';

type ClientsProps = {
  clients: ClientType[];
};

const Clients = ({ clients }: ClientsProps) => {
  return (
    <Stack direction='row' spacing={-0.7} padding='0px 0px'>
      {clients.length > 3 && (
        <Box>
          <Avatar value={`+${clients.length - 3}`} size='30' round='30px' textSizeRatio={2.5} color='lightgray' />
        </Box>
      )}
      {clients.slice(1, 4).map((client, index) => (
        <Box key={index}>
          <Avatar name={client.name} size='30' round='30px' color={client.color} />
        </Box>
      ))}
    </Stack>
  );
};

export default Clients;
