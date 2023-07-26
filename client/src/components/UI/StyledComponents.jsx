import { Box, Badge, Avatar, useTheme, styled, Button } from '../../utils/MuiImports';

export const StyledButton = styled(Button)({
  position: 'relative',
  marginLeft: '2rem',
  maxWidth: '160px',
  cursor: 'pointer',
  border: 'none',

  textTransform: 'capitalize',
  textAlign: 'left',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-10px',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: '#e0e0e0'
  }
});

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

const StyledBadge = ({ badgeContent, status }) => {
  const theme = useTheme().palette.mode;

  return (
    <Box sx={{ ml: 1.5, mr: 2.6, mb: 0.5 }}>
      <Badge
        badgeContent={badgeContent}
        sx={{
          '.MuiBadge-badge': {
            borderRadius: '3px',
            backgroundColor: status === 'error' ? 'crimson' : theme === 'dark' ? '#282c34' : '#eff1f3',
            border: theme === 'dark' ? '2px solid #2c3032' : '2px solid #dbd3d8',
            color: theme === 'dark' ? '#fff' : '#000',
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
export default StyledBadge;
