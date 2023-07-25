import { alpha, styled } from '@mui/material/styles';
import { green, grey, pink, yellow } from '@mui/material/colors';
import Switch from '@mui/material/Switch';

const MySwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: yellow['200'],
    '&:hover': {
      backgroundColor: alpha(pink[200], theme.palette.action.hoverOpacity)
    }
  },
  '& .MuiSwitch-switchBase + .MuiSwitch-track': {
    backgroundColor: theme === 'dark' ? yellow[500] : grey['600']
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: grey[400],
    '&:hover': {
      backgroundColor: alpha(green[700], theme.palette.action.hoverOpacity)
    }
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: theme === 'dark' ? grey[500] : green[100]
  }
}));

export default function ToggleSwitch({ toggleTheme, cellTheme }) {
  return (
    <div>
      <MySwitch onChange={toggleTheme} checked={cellTheme === 'dark'} size='small' />
    </div>
  );
}
