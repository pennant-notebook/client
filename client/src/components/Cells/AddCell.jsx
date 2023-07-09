import { Add, Code } from '@mui/icons-material';
import { Box, Divider, IconButton, Tooltip } from '@mui/material';
import useNotebookContext from '../../contexts/NotebookContext';

const AddCell = ({ index }) => {
  const { addCellAtIndex } = useNotebookContext();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Divider
        flexItem
        sx={{
          ml: '30px',
          opacity: '1',
          width: '82%',
          color: 'gray'
        }}>
        <Tooltip title='Add Markdown Cell'>
          <IconButton
            onClick={() => addCellAtIndex(index, 'markdown')}
            sx={{ opacity: 0.5, '&:hover': { backgroundColor: 'transparent', opacity: 1 } }}>
            <Add sx={{ fontSize: '24px', opacity: '0.6', '&:hover': { opacity: 1 } }} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Add Code Cell'>
          <IconButton
            onClick={() => addCellAtIndex(index, 'code')}
            sx={{ opacity: 0.5, '&:hover': { backgroundColor: 'transparent', opacity: 1 } }}>
            <Code sx={{ fontSize: '24px', opacity: '0.6', '&:hover': { opacity: 1 } }} />
          </IconButton>
        </Tooltip>
      </Divider>
    </Box>
  );
};

export default AddCell;
