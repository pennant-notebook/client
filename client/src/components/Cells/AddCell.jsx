import { Box, Add, Code, Divider, IconButton, Tooltip } from '../MuiImports';
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
          width: '100%',
          marginTop: type === 'code' ? '20px' : '0px',
          marginBottom: '20px'
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
