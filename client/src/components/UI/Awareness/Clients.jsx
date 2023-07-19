import { memo, useState } from 'react';
import Avatar from 'react-avatar';
import { Typography, Button, Box } from '../../../utils/MuiImports';

const Clients = memo(({ clients }) => {
  const [show, setShow] = useState(true);

  return (
    <Box>
      <Box sx={{ ml: '10px' }}>
        <Button sx={{ backgroundColor: '#34568B', opacity: '0.85' }} onClick={() => setShow(!show)} variant='contained'>
          {`${clients && clients.length} Clients`}
        </Button>
      </Box>
      <Box
        className='clients avatars-row'
        sx={{ zIndex: 10, minWidth: '140px', opacity: show ? '0.95' : '0', whiteSpace: 'nowrap' }}>
        {show && (
          <Box sx={{ display: 'flex', flexDirection: 'row', pr: 1 }}>
            {clients &&
              clients.map(client => (
                <div key={client.id} className='client'>
                  <Avatar name={client.name} size={32} round='30px' color={client.color} />
                  {/* <Typography variant='body1'>{client.name}</Typography> */}
                </div>
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
});

export default Clients;
