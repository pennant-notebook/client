import React, { useState } from 'react';
import { Divider, Tooltip, Menu, MenuItem, Box, Button, useTheme } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import AddBoxIcon from '@mui/icons-material/AddBox';
import styles from './AddCell.module.css';

interface AddCellProps {
  index: number;
  noCells?: boolean;
  isDragging?: boolean;
}

interface AnchorPosition {
  mouseX: number;
  mouseY: number;
}

const AddCell: React.FC<AddCellProps> = ({ index, noCells, isDragging }) => {
  const { addCellAtIndex } = useNotebookContext();
  const [anchorEl, setAnchorEl] = useState<AnchorPosition | null>(null);
  const [hover, setHover] = useState(false);
  const theme = useTheme().palette.mode;

  const handleAddCell = (event: React.MouseEvent<HTMLButtonElement>) => {
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
      <Box className={`${styles['add-cell']} ${theme}`} sx={{ ml: -2.4 }}>
        <Tooltip title='Add Cell' enterDelay={1000} enterNextDelay={1000} arrow>
          <Button
            sx={{ opacity: noCells ? 1 : 0.05, width: '100%' }}
            onClick={handleAddCell}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <AddBoxIcon className={`${styles['add-icon']} ${hover ? styles.hover : ''}`} />
            <Box
              sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
              className={`${styles.divider} ${hover ? styles.hover : ''}`}>
              <Divider />
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
    </Box>
  );
};

export default AddCell;
