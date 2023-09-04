import React from 'react';
import useNotebookContext from '../../contexts/NotebookContext';
import {
  CloseSharp,
  PlayCircle,
  Box,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  CircularProgress
} from '../../utils/MuiImports';
import styles from './CodeToolbar.module.css';

interface CodeToolbarProps {
  onClickRun: () => void;
  id: string;
  processing: boolean;
}

const CodeToolbar: React.FC<CodeToolbarProps> = ({ onClickRun, id, processing }) => {
  const { deleteCell } = useNotebookContext();
  return (
    <Box
      sx={{
        backgroundColor: '#282A35',
        height: '40px',
        margin: 0,
        padding: 0,
        zIndex: 0,
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px'
      }}>
      <Stack
        direction='row'
        sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center', mr: 1, p: 1 }}
        spacing={2}>
        <Typography variant='overline' sx={{ color: 'lightgray', position: 'absolute', left: '12px' }}>
          JavaScript
        </Typography>
        <Tooltip title='Run code' enterDelay={1000} enterNextDelay={1000}>
          <span>
            <IconButton className={styles.toolbutton} disabled={processing} onClick={onClickRun}>
              {processing ? <CircularProgress size={24} /> : <PlayCircle />}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Remove cell' enterDelay={1000} enterNextDelay={1000}>
          <span>
            <IconButton
              className={styles.toolbutton}
              disabled={processing}
              onClick={() => deleteCell(id)}
              sx={{ opacity: 0.5, '&:hover': { opacity: 1, backgroundColor: 'transparent' } }}>
              <CloseSharp />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default CodeToolbar;
