import { memo } from 'react';
import { CloseSharp, Box, Stack, Tooltip, IconButton, Typography } from '../../utils/MuiImports';
import ToggleSwitch from '../UI/ToggleSwitch';
import DarkModeToggle from '../UI/DarkModeToggle';

const MarkdownToolbar = memo(({ onDelete, id, toggleTheme, cellTheme }) => {
  return (
    <Box
      sx={{
        backgroundColor: cellTheme === 'dark' ? '#282A35' : '#fff',
        height: '40px',
        margin: 0,
        padding: 0,
        borderBottom: 'none',
        zIndex: 0
      }}>
      <Stack direction='row' sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center', mr: 1 }}>
        <Typography variant='overline' sx={{ color: 'lightgray', position: 'absolute', left: '12px' }}>
          Markdown
        </Typography>
        {/* <DarkModeToggle checked={cellTheme === 'light'} onChange={toggleTheme} /> */}
        <ToggleSwitch cellTheme={cellTheme} toggleTheme={toggleTheme} />
        <Tooltip title='Remove cell'>
          <IconButton
            onClick={() => onDelete(id)}
            sx={{ opacity: 0.5, '&:hover': { opacity: 1, backgroundColor: 'transparent' } }}>
            <CloseSharp sx={{ color: 'lightgray' }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
});

export default MarkdownToolbar;
