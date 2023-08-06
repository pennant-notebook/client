import { Box, Badge, useTheme, styled, Button, Avatar } from '../../utils/MuiImports';

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

export const CellPosAvatar = ({ index }) => {
  return (
    <Avatar
      sx={{
        width: 18,
        height: 18,
        fontSize: '11px',
        fontFamily: 'Fira Code',
        color: '#b9b7b7',
        backgroundColor: 'transparent',
        opacity: 0.8,
        border: '1px solid transparent',
        p: index > 99 ? 1.2 : 1.1,
        zIndex: 1
      }}>
      {index}
    </Avatar>
  );
};

const StyledBadge = ({ badgeContent, status }) => {
  const theme = useTheme().palette.mode;
  return (
    <Box sx={{ ml: 1.5, mr: 2 }}>
      <Box
        sx={{
          borderRadius: '3px',
          backgroundColor:
            status === 'error'
              ? 'crimson'
              : status === 'critical'
              ? 'yellow'
              : theme === 'dark'
              ? '#282c34'
              : '#eff1f3',
          color: theme === 'dark' ? '#fff' : '#3d414d',

          width: badgeContent > 99 ? '24px' : '22px',
          fontFamily: 'MonoLisa',
          height: '22px',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ml: -2,
          opacity: '1',
          boxShadow:
            theme === 'light'
              ? `rgba(6, 24, 44, 0.4) 0px 0px 0px 1px, rgba(6, 24, 44, 0.65) 0px 2px 2px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset`
              : `rgba(3, 102, 214, 0.3) 0px 0px 0px 2px;`
        }}>
        {badgeContent}
      </Box>
    </Box>
  );
};

export default StyledBadge;
