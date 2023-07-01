import { Add, Code } from '@mui/icons-material';
import { Box, Divider, IconButton, Tooltip } from '@mui/material';
import NotebookContext from './NotebookContext';
import { useContext } from 'react';

const AddCell = ({ index, hover, setHover, isFirst }) => {
  const { addCellAtIndex } = useContext(NotebookContext);

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{ display: 'flex', justifyContent: 'center' }}>
      <Divider
        flexItem
        sx={{
          ml: '30px',
          opacity: hover ? '1' : '0',
          width: '82%',
          color: hover ? 'gray' : 'transparent'
        }}>
        <Tooltip title={isFirst ? 'Add Markdown Cell Above' : 'Add Markdown Cell'}>
          <IconButton
            onClick={() => addCellAtIndex(index, 'markdown')}
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
            <Add sx={{ fontSize: '24px', opacity: '0.6', '&:hover': { opacity: 1 } }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={isFirst ? 'Add Code Cell Above' : 'Add Code Cell'}>
          <IconButton
            onClick={() => addCellAtIndex(index, 'code')}
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
            <Code sx={{ fontSize: '24px', opacity: '0.6', '&:hover': { opacity: 1 } }} />
          </IconButton>
        </Tooltip>
      </Divider>
    </Box>
  );
};

export default AddCell;
