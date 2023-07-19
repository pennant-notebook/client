import { memo } from 'react';
import { CloseSharp, Box, Stack, Tooltip, IconButton, Typography } from '../../utils/MuiImports';
import ToggleSwitch from '../UI/ToggleSwitch';

const MarkdownToolbar = memo(({ onDelete, id, theme, toggleTheme }) => {
  return (
    <Box
      sx={{
        backgroundColor: theme === 'light' ? '#fff' : '#282A35',
        height: '40px',
        margin: 0,
        padding: 0,
        borderBottom: 'none',
        zIndex: 0
      }}>
      <Stack direction='row' sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center' }}>
        <Typography variant='overline' sx={{ color: 'lightgray', position: 'absolute', left: '12px' }}>
          Markdown
        </Typography>

        <ToggleSwitch toggleTheme={toggleTheme} />

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
