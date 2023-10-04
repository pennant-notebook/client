import { MouseEvent } from 'react';
import { IconButton, Typography, Stack } from '~/utils/MuiImports';

interface IconRowProps {
  icon: JSX.Element;
  text?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

const IconRow = ({ icon, text, onClick }: IconRowProps) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        borderRadius: text ? '12px' : 'auto',
        py: text ? 2 : 1,
        width: text ? '100%' : 'auto',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}>
      <Stack direction='row' spacing={1} alignItems='center'>
        {icon}
        {text && <Typography sx={{ fontFamily: 'Lato', fontSize: '1rem' }}>{text}</Typography>}
      </Stack>
    </IconButton>
  );
};
export default IconRow;
