import { CloseSharp, Box, Stack, Tooltip, IconButton, Typography } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import styles from './MarkdownCell.module.css';

interface MarkdownToolbarProps {
  id: string;
  cellTheme: string;
}

const MarkdownToolbar = ({ id, cellTheme }: MarkdownToolbarProps) => {
  const { deleteCell } = useNotebookContext();

  const buttonColor = cellTheme === 'dark' ? '#e1e1ea' : '#2c3032';
  return (
    <Box className={`${styles['markdown-toolbar']} ${styles[cellTheme]}`}>
      <Stack direction='row' sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center', mr: 1 }}>
        <Typography variant='overline' sx={{ color: buttonColor, position: 'absolute', left: '12px' }}>
          Markdown
        </Typography>
        <Tooltip title='Remove cell' enterDelay={1000} enterNextDelay={1000}>
          <IconButton
            onClick={() => deleteCell(id)}
            sx={{ opacity: 0.5, '&:hover': { opacity: 1, backgroundColor: 'transparent' } }}>
            <CloseSharp sx={{ color: buttonColor }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default MarkdownToolbar;
