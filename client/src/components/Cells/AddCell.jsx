import { Box, Add, Code, Divider, IconButton, Tooltip } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';

const AddCell = ({ index, isDragging }) => {
  const { addCellAtIndex } = useNotebookContext();
  return (
    <Box sx={{ my: '10px', opacity: isDragging ? '0.5' : '1' }}>
      <Divider flexItem sx={{ width: '100%', borderColor: 'transparent' }}>
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
