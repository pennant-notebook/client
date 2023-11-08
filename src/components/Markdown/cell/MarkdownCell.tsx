import { useEffect, useRef } from 'react';
import { MarkdownCellProps } from '@/CellPropsTypes';
import { AwarenessUserState } from '@/ClientTypes';
import { ProviderContextType } from '@/ProviderTypes';
import '@blocknote/core/style.css';
import useProviderContext from '~/contexts/ProviderContext';
import { getUserObjects } from '~/utils/notebookHelpers';
import styles from './MarkdownCell.module.css';
import MarkdownEditor from './MarkdownEditor';
import MarkdownToolbar from '../toolbar/MarkdownToolbar';
import { useTheme } from '~/utils/MuiImports';

const MarkdownCell: React.FC<MarkdownCellProps> = ({ id, cell }) => {
  const { provider, awareness } = useProviderContext() as ProviderContextType;

  const cellRef = useRef<HTMLDivElement>(null);
  const theme = useTheme().palette.mode;
  const users = getUserObjects(awareness.getStates() as Map<number, AwarenessUserState>);
  const currentUser = users[0];

  useEffect(() => {
    const element = document.querySelector(`#blockcell-${id} div div`);
    if (element) {
      element.setAttribute('data-theme', theme);
    }
  }, [theme, id]);

  return (
    <div
      ref={cellRef}
      data-id='markdown-cell-box'
      className={styles.markdownCellBox}
      style={{
        alignItems: 'center',
        flexGrow: 0,
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        marginLeft: '32px'
      }}>
      <div className={`${styles['markdown-container']} ${styles[theme]}`} data-id='markdown-container'>
        <MarkdownToolbar id={id} cellTheme={styles[theme]} data-id='markdown-toolbar' />
        <div id={`blockcell-${id}`} data-id='markdown-editor-box'>
          <MarkdownEditor
            content={cell.get('content')}
            provider={provider}
            currentUser={currentUser}
            theme={theme}
            data-id='markdown-editor'
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownCell;
