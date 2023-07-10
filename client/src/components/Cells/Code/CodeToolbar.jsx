import { memo } from 'react';
import { CloseSharp, DragIndicator, PlayCircle } from '@mui/icons-material';
import { Box, Stack, Tooltip, IconButton, Typography } from '@mui/material';

const CodeToolbar = memo(({ onClickRun, onDelete, id }) => {
  return (
    <Box sx={{ backgroundColor: '#282A35', height: '40px', margin: 0, padding: 0, borderBottom: '1px solid gray' }}>
      <Stack direction='row' sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center' }}>
        <Typography variant='overline' sx={{ color: 'lightgray', position: 'absolute', left: '12px' }}>
          JavaScript
        </Typography>
        <Tooltip title='Run code'>
          <IconButton onClick={onClickRun} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
            <PlayCircle sx={{ color: 'lightgray' }} />
          </IconButton>
        </Tooltip>
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

export default CodeToolbar;
