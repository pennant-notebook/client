import { useState, MouseEvent } from 'react';
import { Divider, Tooltip, Menu, MenuItem, Box, Button, useTheme } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import AddBoxIcon from '@mui/icons-material/AddBox';

interface AddCellProps {
  index: number;
  noCells?: boolean;
  isDragging?: boolean;
}

interface AnchorPosition {
  mouseX: number;
  mouseY: number;
}

const AddCell = ({ index, noCells, isDragging }: AddCellProps) => {
  const { addCellAtIndex } = useNotebookContext();
  const [anchorEl, setAnchorEl] = useState<AnchorPosition | null>(null);
  const [hover, setHover] = useState(false);
  const theme = useTheme().palette.mode;

  const handleAddCell = (event: MouseEvent<HTMLButtonElement>) => {
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
    <Box
      sx={{
        opacity: isDragging ? 0 : 1,
        my: '0px',
        width: '75%',
        mx: 'auto'
      }}>
      <Box className={`add-cell ${theme}`} sx={{ ml: -2.4 }}>
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ width: '100%' }}>
          <Tooltip title='Add Cell' enterDelay={1000} enterNextDelay={1000} arrow>
            {noCells ? (
              <Button sx={{ opacity: 0.5, '&:hover': { opacity: 0.75 }, width: '100%' }} onClick={handleAddCell}>
                <AddBoxIcon className={`add-icon ${hover ? 'hovered' : ''}`} />
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                  <Divider />
                </Box>
              </Button>
            ) : (
              <Button sx={{ opacity: 0.05, '&:hover': { opacity: 0.75 }, width: '100%' }} onClick={handleAddCell}>
                <AddBoxIcon className={`add-icon ${hover ? 'hovered' : ''}`} />
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', opacity: hover ? 0.5 : 0.05 }}>
                  <Divider />
                </Box>
              </Button>
            )}
          </Tooltip>
        </div>

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
    </Box>
  );
};

export default AddCell;
