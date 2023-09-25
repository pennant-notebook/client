import useNotebookContext from '~/contexts/NotebookContext';
import {
  Box,
  CircularProgress,
  CloseSharp,
  IconButton,
  PlayCircle,
  MenuItem,
  Stack,
  Tooltip
} from '~/utils/MuiImports';
import styles from './CodeToolbar.module.css';
import LanguageSelector from './LanguageSelector';

interface CodeToolbarProps {
  onClickRun: () => void;
  id: string;
  processing: boolean;
  language: string;
  setLanguage: (language: string) => void;
}

const CodeToolbar = ({ onClickRun, id, processing, language, setLanguage }: CodeToolbarProps) => {
  const { deleteCell } = useNotebookContext();

  return (
    <Box
      data-test='codeToolbarContainer'
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
        data-test='toolbarStack'
        direction='row'
        sx={{ justifyContent: 'end', position: 'relative', alignItems: 'center', mr: 1, p: 1 }}
        spacing={2}>
        <LanguageSelector
          data-test='languageSelector'
          select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          variant='standard'>
          <MenuItem data-test='languageOption-js' value='javascript'>
            JavaScript
          </MenuItem>
          <MenuItem data-test='languageOption-python' value='python'>
            Python
          </MenuItem>
        </LanguageSelector>
        <Tooltip title='Run code' enterDelay={1000} enterNextDelay={1000}>
          <span>
            <IconButton
              data-test='runCodeButton'
              className={styles.toolbutton}
              disabled={processing}
              onClick={onClickRun}>
              {processing ? <CircularProgress data-test='loadingIndicator' size={24} /> : <PlayCircle />}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Remove cell' enterDelay={1000} enterNextDelay={1000}>
          <span>
            <IconButton
              data-test='removeCellButton'
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
