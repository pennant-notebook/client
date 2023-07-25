import { IconButton, Typography, Stack } from '../../utils/MuiImports';

const IconRow = ({ icon, text, onClick }) => {
  return (
    <IconButton onClick={onClick} sx={{ borderRadius: '12px' }}>
      <Stack direction='row' spacing={1} alignItems='center' justifyContent='center'>
        {icon}
        <Typography sx={{ fontFamily: 'Lato', fontSize: '1rem' }}>{text}</Typography>
      </Stack>
    </IconButton>
  );
};
export default IconRow;
