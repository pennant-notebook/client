import { memo } from 'react';
import Avatar from 'react-avatar';
import { Typography } from '../../../utils/MuiImports';

const Clients = memo(({ clients }) => {
  return clients.map(client => (
    <div key={client.id} className='client-avatar'>
      <Avatar name={client.name} size={32} round='30px' color={client.color} />
      <Typography variant='body1'>{client.name}</Typography>
    </div>
  ));
});

export default Clients;
