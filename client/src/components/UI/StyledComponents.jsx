import { Box, Badge, useTheme, Typography, styled, Button } from '../../utils/MuiImports';

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
        top: -12.5,
        right: -5,
        zIndex: -1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'visible',
        opacity: theme === 'dark' ? 0.5 : 0.8
      }}>
      <Box
        sx={{
          width: pos >= 100 ? '18px' : pos >= 10 ? '20px' : '22px',
          height: '0px',
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'visible',
          position: 'absolute'
        }}>
        <svg
          height='100pt'
          id='svg548'
          width='100pt'
          xmlns='http://www.w3.org/2000/svg'
          style={{
            filter: theme === 'dark' ? 'drop-shadow(3px 0px 0px #e0e0e0)' : 'drop-shadow(4px 0px 0px #e0e0e0)'
          }}>
          <path
            d='M 53.7043 164.348 C 52.5855 164.348 425.159 165.467 425.159 165.467 L 479.983 269.519 L 425.159 378.046 L 52.5855 375.809 L 107.409 269.519 L 53.7043 164.348 z '
            id='index-icon'
            style={{
              fill: theme === 'light' ? '#f5f5f5' : '#282a34',
              fillRule: 'evenodd',
              stroke: theme === 'light' ? '#282A34' : 'lightgray',
              strokeOpacity: theme === 'light' ? 0.2 : 0.5,
              strokeWidth: '7pt',
              strokeLinejoin: 'miter',
              strokeLinecap: 'butt',
              fillOpacity: 1
            }}
            transform='scale(0.088) translate(-13.42607,-10.06958)'
          />
        </svg>
        <Typography
          sx={{
            color: theme === 'light' ? 'black' : '#cecece',
            fontFamily: 'Lato',
            fontSize: pos >= 100 ? '11px' : '12px',
            position: 'absolute',
            right: pos >= 100 ? -16 : pos >= 10 ? -14 : -9,
            top: 14
          }}>
          {pos}
        </Typography>
      </Box>
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
            backgroundColor:
              status === 'error'
                ? 'crimson'
                : status === 'critical'
                ? 'yellow'
                : theme === 'dark'
                ? '#282c34'
                : '#eff1f3',
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
