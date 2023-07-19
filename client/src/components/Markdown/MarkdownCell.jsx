import { useRef, useEffect, useState } from 'react';
import { Box } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import { getUserObjects } from '../../utils/notebookHelpers';
import useProviderContext from '../../contexts/ProviderContext';
import MarkdownToolbar from './MarkdownToolbar';

import '@blocknote/core/style.css';

const MarkdownCell = ({ id, content, provider, cell }) => {
  const { awareness } = useProviderContext();
  const [theme, setTheme] = useState(cell.get('theme').toString());
  const { deleteCell } = useNotebookContext();
  const cellRef = useRef(null);

  const users = getUserObjects(awareness.getStates());
  const currentUser = users[0];

  const editor = useBlockNote({
    theme: cell.get('theme').toString(),
    collaboration: {
      provider,
      fragment: content,
      user: {
        name: currentUser ? currentUser.name : 'Default',
        color: currentUser ? currentUser.color : '#ff0000'
      }
    },
    editorDOMAttributes: {
      style: 'padding: 0px 24px; border-radius: 0px'
    }
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    // Add logic here to target the div with id blockcell-id and change the data-theme attribute for that div
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
          <BlockNoteView id={id} editor={editor} />
        </Box>
      </Box>
    </Box>
  );
};

export default MarkdownCell;
