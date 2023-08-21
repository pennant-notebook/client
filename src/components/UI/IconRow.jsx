import { IconButton, Typography, Stack } from '../../utils/MuiImports';

const IconRow = ({ icon, text, onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        borderRadius: text ? '12px' : 'auto',
        py: text ? 2 : 1,
        width: text ? '100%' : 'auto',
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
      <Stack direction='row' spacing={1} alignItems='center'>
        {icon}
        {text && <Typography sx={{ fontFamily: 'Lato', fontSize: '1rem' }}>{text}</Typography>}
      </Stack>
    </IconButton>
  );
};
export default IconRow;
