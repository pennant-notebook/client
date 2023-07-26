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
      <Stack
        direction='row'
        sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center', mr: 1, p: 1 }}
        spacing={2}>
        <Typography variant='overline' sx={{ color: 'lightgray', position: 'absolute', left: '12px' }}>
          JavaScript
        </Typography>
        <Tooltip title='Run code' enterDelay={1000}>
          <span>
            <IconButton className='toolbutton' disabled={processing} onClick={onClickRun}>
              {processing || allRunning ? <CircularProgress size={24} /> : <PlayCircle size={24} />}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Remove cell' enterDelay={1000}>
          <span>
            <IconButton
              className='toolbutton'
              disabled={processing}
              onClick={() => onDelete(id)}
              sx={{ opacity: 0.5, '&:hover': { opacity: 1, backgroundColor: 'transparent' } }}>
              <CloseSharp size={24} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default CodeToolbar;
