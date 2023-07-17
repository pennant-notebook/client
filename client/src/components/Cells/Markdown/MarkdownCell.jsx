import { useRef } from 'react';
import { Box } from '../../../utils/MuiImports';
import useNotebookContext from '../../../contexts/NotebookContext';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import { getUserObjects } from '../../../utils/awarenessHelpers';
import useProviderContext from '../../../contexts/ProviderContext';
import CodeToolbar from '../Code/CodeToolbar';
import '@blocknote/core/style.css';

const MarkdownCell = ({ id, content, provider }) => {
  const { awareness } = useProviderContext();

  const users = getUserObjects(awareness.getStates());
  const currentUser = users[0];

  const { deleteCell } = useNotebookContext();
  const cellRef = useRef(null);
  const editor = useBlockNote({
    collaboration: {
      provider,
      fragment: content,
      user: {
        name: currentUser ? currentUser.name : 'Default',
        color: currentUser ? currentUser.color : '#ff0000'
      }
    },
    editorDOMAttributes: {
      style: 'padding: 0px 24px;'
    }
  });

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
        <CodeToolbar type='markdown' id={id} onDelete={deleteCell} />
        <Box>
          <BlockNoteView id={id} editor={editor} />
        </Box>
      </Box>
    </Box>
  );
};

export default MarkdownCell;
