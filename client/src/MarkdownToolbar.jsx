import { CloseSharp, PlayCircle } from '@mui/icons-material';
import { Box, Stack, Tooltip, IconButton, Typography } from '@mui/material';

const MarkdownToolbar = ({ onClickRun, onDelete, id }) => {
  return (
    <Box sx={{ backgroundColor: 'white', height: '40px', margin: 0, padding: 0, borderBottom: '1px solid gray' }}>
      <Stack direction='row' sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center' }}>
      <Typography  sx={{ color: 'black', position: 'absolute', left: '12px' }}>
          Markdown
        </Typography>
        <Tooltip title='Remove cell'>
          <IconButton onClick={() => { console.log('id', id); onDelete(id)}} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
            <CloseSharp sx={{ color: 'lightgray' }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};
export default MarkdownToolbar;