import { useTheme } from '~/utils/MuiImports';
import useNotebookContext from '~/contexts/NotebookContext';
import styles from './AddCell.module.css';
import { Button, Typography } from 'antd';

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
    <div
      style={{
        opacity: isDragging ? 0 : 1,
        marginTop: '10px',
        marginBottom: '10px',
        width: '72%',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
      <div className={`add-cell ${theme}`} style={{ marginLeft: 28 }}>
        <div className={noCells ? styles['button-container-noCells'] : styles['button-container']}>
          <Button
            className={`${styles['add-code-button']} ${styles[theme]}`}
            title='Add a code cell'
            onClick={handleAddCode}
            type='primary'>
            <Typography.Text className={`${styles['button-text']}`}>+ Code</Typography.Text>
          </Button>
          <Button
            className={`${styles['add-markdown-button']} ${styles[theme]}`}
            title='Add a markdown text cell'
            onClick={handleAddMarkdown}
            type='primary'>
            <Typography.Text className={styles['button-text']}>+ Markdown</Typography.Text>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCell;
