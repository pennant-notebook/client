import { alpha, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Switch from '@mui/material/Switch';

const MySwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: grey[400],
    '&:hover': {
      // backgroundColor: alpha(grey[700], theme.palette.action.hoverOpacity)
      backgroundColor: alpha(grey[700], theme.palette.action.hoverOpacity)
    }
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: grey[700]
  }
}));

export default function ToggleSwitch({ toggleTheme, cellTheme }) {
  return (
    <div>
      <MySwitch onChange={toggleTheme} checked={cellTheme === 'dark'} />
    </div>
  );
}
