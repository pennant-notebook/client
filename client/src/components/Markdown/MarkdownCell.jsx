import { useRef, useEffect } from 'react';
import { Box, useTheme } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import MarkdownToolbar from './MarkdownToolbar';
import { getUserObjects } from '../../utils/notebookHelpers';
import MarkdownEditor from './MarkdownEditor';
import useProviderContext from '../../contexts/ProviderContext';
import '@blocknote/core/style.css';

const MarkdownCell = ({ id, content, cell }) => {
  const { provider, awareness } = useProviderContext();
  const { deleteCell } = useNotebookContext();

  const cellRef = useRef(0);
  const theme = useTheme().palette.mode;
  const users = getUserObjects(awareness.getStates());
  const currentUser = users[0];

  useEffect(() => {
    const element = document.querySelector(`#blockcell-${id} div div`);
    if (element) {
      element.setAttribute('data-theme', theme);
    }
  }, [theme, id]);

  return (
    <Box
      ref={cellRef}
      sx={{
        alignItems: 'center',
        flexGrow: 0,
        wordBreak: 'break-word',
        overflorWrap: 'break-word',
        ml: 4.2
      }}>
      <Box className={`markdown-container ${theme}`}>
        <MarkdownToolbar id={id} onDelete={deleteCell} cellTheme={theme} />
        <Box id={`blockcell-${id}`}>
          <MarkdownEditor
            id={`markdown-editor-${id}`}
            cell={cell}
            content={content}
            provider={provider}
            currentUser={currentUser}
            theme={theme}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MarkdownCell;
