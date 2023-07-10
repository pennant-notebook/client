import { Add, Code } from '@mui/icons-material';
import { Box, Divider, IconButton, Tooltip } from '@mui/material';
import useNotebookContext from '../../contexts/NotebookContext';

const AddCell = ({ index, type }) => {
  const { addCellAtIndex } = useNotebookContext();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '80%',
        margin: '0 auto'
      }}>
      <Divider
        flexItem
        sx={{
          opacity: '1',
          width: '100%', // Change the width to be 100% of the parent
          color: 'gray',
          marginTop: type === 'code' ? '10px' : '0px',
          marginBottom: type === 'markdown' ? '10px' : '0px'
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
