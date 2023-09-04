import Avatar from 'react-avatar';
import { Box } from '../../../utils/MuiImports';
import styles from './Clients.module.css';
import React from 'react';
import { ClientType } from '@/ClientTypes';

type ClientsProps = {
  clients: ClientType[];
};

const Clients: React.FC<ClientsProps> = ({ clients }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', maxWidth: '120px' }}>
      {clients.length > 3 && (
        <Box className='user-widget'>
          <Avatar value={`+${clients.length - 3}`} size='30' round='30px' textSizeRatio={2.5} color='lightgray' />
        </Box>
      )}
      {clients.slice(1, 4).map((client, index) => (
        <Box key={index} className={styles.userWidget}>
          <Avatar name={client.name} size='30' round='30px' color={client.color} />
        </Box>
      ))}
    </Box>
  );
};

export default Clients;
