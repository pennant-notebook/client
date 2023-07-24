import { useRef, useEffect, useState } from 'react';
import { Box } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import MarkdownToolbar from './MarkdownToolbar';
import { getUserObjects } from '../../utils/notebookHelpers';
import MarkdownEditor from './MarkdownEditor';
import useProviderContext from '../../contexts/ProviderContext';
import '@blocknote/core/style.css';

const MarkdownCell = ({ id, content, cell, refreshCount }) => {
  const { provider, awareness } = useProviderContext();
  const { deleteCell } = useNotebookContext();
  const [theme, setTheme] = useState(cell.get('theme').toString());
  const cellRef = useRef(0);

  const users = getUserObjects(awareness.getStates());
  const currentUser = users[0];

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      cell.set('theme', newTheme);
    });
  };

  useEffect(() => {
    const element = document.querySelector(`#blockcell-${id} div div`);
    if (element) {
      element.setAttribute('data-theme', theme);
      setTheme(cell.get('theme'));
    }
  }, [theme, id]);

  return (
    <Box
      ref={cellRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexGrow: 0,
        wordBreak: 'break-word',
        overflorWrap: 'break-word',
        ml: 4.2
      }}>
      <Box className='markdown-container'>
        <MarkdownToolbar id={id} onDelete={deleteCell} cellTheme={cell.get('theme')} toggleTheme={toggleTheme} />
        <Box id={`blockcell-${id}`}>
          <MarkdownEditor
            id={`markdown-editor-${id}`}
            key={`${id}-${refreshCount}`}
            cell={cell}
            content={content}
            provider={provider}
            currentUser={currentUser}
            theme={cell.get('theme').toString()}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MarkdownCell;
