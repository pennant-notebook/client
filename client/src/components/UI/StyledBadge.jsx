import { useTheme } from '@mui/material';
import { Box, Badge, Avatar } from '../../utils/MuiImports';

const StyledBadge = ({ badgeContent, status }) => {
  return (
    <Box sx={{ ml: 1.5, mr: 2.6, mb: 0.5 }}>
      <Badge
        badgeContent={badgeContent}
        sx={{
          '.MuiBadge-badge': {
            borderRadius: '3px',
            backgroundColor: status === 'error' ? 'crimson' : '#eff1f3',
            border: '2px solid gray',
            color: 'black',
            width: badgeContent ? '22px' : '18px',
            minWidth: '18px',
            height: '24px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '1'
          }
        }}
      />
    </Box>
  );
};

export const CellPosAvatar = ({ pos }) => {
  const theme = useTheme().palette.mode;
  return (
    <Box
      sx={{
        position: 'absolute',
        top: -5,
        right: -10
      }}>
      <Avatar
        sx={{
          color: theme === 'light' ? 'black' : '#cecece',
          backgroundColor: theme === 'light' ? '#dbd3d8' : 'darkorchid',
          boxShadow: '0px 0px 2px 1px rgba(0,0,0,0.2)',
          borderRadius: '15px',
          fontFamily: 'Lato',
          width: '18px',
          height: '18px',
          fontSize: '11px',
          opacity: '0.9'
        }}>
        {pos}
      </Avatar>
    </Box>
  );
};

export default StyledBadge;
