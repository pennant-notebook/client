import { MarkdownCellProps } from '@/CellPropsTypes';
import { UserState } from '@/ClientTypes';
import { ProviderContextType } from '@/ProviderTypes';
import '@blocknote/core/style.css';
import { useEffect, useRef } from 'react';
import useProviderContext from '~/contexts/ProviderContext';
import { Box, useTheme } from '~/utils/MuiImports';
import { getUserObjects } from '~/utils/notebookHelpers';
import styles from './MarkdownCell.module.css';
import MarkdownEditor from './MarkdownEditor';
import MarkdownToolbar from '../toolbar/MarkdownToolbar';

const MarkdownCell = ({ id, cell }: MarkdownCellProps) => {
  const { provider, awareness } = useProviderContext() as ProviderContextType;

  const cellRef = useRef(0);
  const theme = useTheme().palette.mode;
  const users = getUserObjects(awareness.getStates() as Map<number, UserState>);
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
      data-id='markdown-cell-box'
      sx={{
        alignItems: 'center',
        flexGrow: 0,
        wordBreak: 'break-word',
        overflorWrap: 'break-word',
        ml: 4
      }}>
      <Box className={`${styles['markdown-container']} ${theme}`} data-id='markdown-container'>
        <MarkdownToolbar id={id} cellTheme={theme} data-id='markdown-toolbar' />
        <Box id={`blockcell-${id}`} data-id='markdown-editor-box'>
          <MarkdownEditor
            content={cell.get('content')}
            provider={provider}
            currentUser={currentUser}
            theme={theme}
            data-id='markdown-editor'
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MarkdownCell;
