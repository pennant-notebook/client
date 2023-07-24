import Avatar from 'react-avatar';
import { Box, useTheme } from '../../../utils/MuiImports';

const Clients = ({ clients, show }) => {
  const theme = useTheme().palette.mode;
  return (
    <Box>
      <Box
        className={`avatars-row ${theme}`}
        sx={{ zIndex: 10, minWidth: '140px', opacity: show ? '0.95' : '0', whiteSpace: 'nowrap' }}>
        {show && (
          <Box sx={{ display: 'flex', flexDirection: 'row', pr: 1 }}>
            {clients &&
              clients.map(client => (
                <div key={client.id} className='client-avatar'>
                  <Avatar name={client.name} size={32} round='30px' color={client.color} />
                  {/* <Typography variant='body1'>{client.name}</Typography> */}
                </div>
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Clients;
