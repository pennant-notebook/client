import { Box, Typography, useTheme } from '~/utils/MuiImports';
import useNotebookContext from '~/contexts/NotebookContext';
import styles from './AddCell.module.css';

interface AddCellProps {
  index: number;
  noCells?: boolean;
  isDragging?: boolean;
}

const AddCell = ({ index, noCells, isDragging }: AddCellProps) => {
  const { addCellAtIndex } = useNotebookContext();
  const theme = useTheme().palette.mode;

  const handleAddMarkdown = () => {
    addCellAtIndex(index, 'markdown');
  };

  const handleAddCode = () => {
    addCellAtIndex(index, 'code');
  };

  return (
    <Box
      sx={{
        opacity: isDragging ? 0 : 1,
        my: '10px',
        width: '72%',
        mx: 'auto'
      }}>
      <Box className={`add-cell ${theme}`} sx={{ ml: 3.5 }}>
        <Box className={noCells ? styles['button-container-noCells'] : styles['button-container']}>
          <button className={styles['add-code-button']} title='Add a code cell' onClick={handleAddCode}>
            <Typography className={styles['button-text']}>+ Code</Typography>
          </button>
          <button
            className={styles['add-markdown-button']}
            title='Add a markdown text cell'
            onClick={handleAddMarkdown}>
            <Typography className={styles['button-text']}>+ Markdown</Typography>
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddCell;
