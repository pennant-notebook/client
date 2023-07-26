import { memo } from 'react';
import { CloseSharp, Box, Stack, Tooltip, IconButton, Typography } from '../../utils/MuiImports';
import { grey } from '@mui/material/colors';

const MarkdownToolbar = memo(({ onDelete, id, toggleTheme, cellTheme }) => {
  const buttonColor = cellTheme === 'dark' ? '#e1e1ea' : '#2c3032';
  return (
    <Box
      sx={{
        backgroundColor: cellTheme === 'dark' ? '#282A35' : grey[100],
        height: '40px',
        margin: 0,
        padding: 0,
        borderBottom: 'none',
        zIndex: 0
      }}>
      <Stack direction='row' sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center', mr: 1 }}>
        <Typography variant='overline' sx={{ color: buttonColor, position: 'absolute', left: '12px' }}>
          Markdown
        </Typography>
        <Tooltip title='Remove cell' enterDelay={1000} enterNextDelay={1000}>
          <IconButton
            onClick={() => onDelete(id)}
            sx={{ opacity: 0.5, '&:hover': { opacity: 1, backgroundColor: 'transparent' } }}>
            <CloseSharp sx={{ color: buttonColor }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
});

export default MarkdownToolbar;
