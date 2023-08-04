import { Divider, Tooltip, Menu, MenuItem, Box, Button, useTheme } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useState } from 'react';

const AddCell = ({ index, noCells }) => {
  const { addCellAtIndex } = useNotebookContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [hover, setHover] = useState(false);
  const theme = useTheme().palette.mode;

  const handleAddCell = event => {
    event.preventDefault();

    setAnchorEl({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddMarkdown = () => {
    addCellAtIndex(index, 'markdown');
    handleClose();
  };

  const handleAddCode = () => {
    addCellAtIndex(index, 'code');
    handleClose();
  };

  return (
    <Box className={`add-cell ${theme}`}>
      <Tooltip title='Add Cell' enterDelay={1000} enterNextDelay={1000} arrow>
        <Button
          sx={{ opacity: noCells ? 1 : 0.05 }}
          onClick={handleAddCell}
          className={`add-icon-button`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}>
          <AddBoxIcon className={`add-icon ${hover ? 'hover' : ''}`} />
          <Box
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
            className={`divider ${hover ? 'hover' : ''}`}>
            <Divider flexItem sx={{ width: '100%' }} />
          </Box>
        </Button>
      </Tooltip>

      <Menu
        keepMounted
        open={anchorEl !== null}
        onClose={handleClose}
        anchorReference='anchorPosition'
        anchorPosition={anchorEl !== null ? { top: anchorEl.mouseY, left: anchorEl.mouseX } : undefined}>
        <MenuItem onClick={handleAddMarkdown}>Add Markdown Cell</MenuItem>
        <MenuItem onClick={handleAddCode}>Add Code Cell</MenuItem>
      </Menu>
    </Box>
  );
};

export default AddCell;
