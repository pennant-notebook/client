import {
  CloseSharp,
  PlayCircle,
  Box,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  CircularProgress,
  Refresh
} from '../../utils/MuiImports';

const CodeToolbar = ({ onClickRun, onDelete, id, processing, allRunning }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#282A35',
        height: '40px',
        margin: 0,
        padding: 0,
        zIndex: 0
      }}>
      <Stack direction='row' sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center', mr: 1 }}>
        <Typography variant='overline' sx={{ color: 'lightgray', position: 'absolute', left: '12px' }}>
          JavaScript
        </Typography>
        <Tooltip title='Run code'>
          <span>
            <IconButton
              disabled={processing}
              onClick={onClickRun}
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
              {processing || allRunning ? (
                <CircularProgress size={16} sx={{ color: 'lightgray' }} />
              ) : (
                <PlayCircle sx={{ color: 'lightgray' }} />
              )}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Remove cell'>
          <span>
            <IconButton
              disabled={processing}
              onClick={() => onDelete(id)}
              sx={{ opacity: 0.5, '&:hover': { opacity: 1, backgroundColor: 'transparent' } }}>
              <CloseSharp sx={{ color: 'lightgray' }} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default CodeToolbar;
