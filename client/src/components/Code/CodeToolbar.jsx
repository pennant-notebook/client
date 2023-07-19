import { memo } from 'react';
import {
  CloseSharp,
  PlayCircle,
  Box,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  CircularProgress
} from '../../utils/MuiImports';

const CodeToolbar = memo(({ onClickRun, onDelete, id, processing }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#282A35',
        height: '40px',
        margin: 0,
        padding: 0,
        borderBottom: '1px solid gray',
        zIndex: 0
      }}>
      <Stack direction='row' sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center' }}>
        <Typography variant='overline' sx={{ color: 'lightgray', position: 'absolute', left: '12px' }}>
          JavaScript
        </Typography>
        <Tooltip title='Run code'>
          <IconButton disabled={processing} onClick={onClickRun} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
            {processing ? (
              <CircularProgress size={24} sx={{ color: 'lightgray' }} />
            ) : (
              <PlayCircle sx={{ color: 'lightgray' }} />
            )}
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
