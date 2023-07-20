import { useRef, useEffect, useState } from 'react';
import { Box } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import MarkdownToolbar from './MarkdownToolbar';
import { getUserObjects } from '../../utils/notebookHelpers';

import '@blocknote/core/style.css';
import MarkdownEditor from './MarkdownEditor';
import useProviderContext from '../../contexts/ProviderContext';

const MarkdownCell = ({ id, content, cell, provider, refreshCount }) => {
  const { awareness } = useProviderContext();
  const { deleteCell } = useNotebookContext();
  const cellRef = useRef(0);
  const users = getUserObjects(awareness.getStates());
  const currentUser = users[0];

  const [theme, setTheme] = useState(cell.get('theme').toString());

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const element = document.querySelector(`#blockcell-${id} div div`);
    if (element) {
      element.setAttribute('data-theme', theme);
      cell.set('theme', theme);
    }
  }, [theme, id]);

  return (
    <Box
      ref={cellRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexGrow: 0,
        wordBreak: 'break-all',
        overflorWrap: 'break-word',
        ml: 3.5
      }}>
      <Box className='markdown-container'>
        <MarkdownToolbar id={id} onDelete={deleteCell} theme={theme} toggleTheme={toggleTheme} />
        <Box id={`blockcell-${id}`}>
          <MarkdownEditor
            id={`markdown-editor-${id}`}
            key={`${id}-${refreshCount}`}
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
