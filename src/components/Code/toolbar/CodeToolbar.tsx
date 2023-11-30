import useNotebookContext from '~/contexts/NotebookContext';
import { Button, Tooltip, Typography } from 'antd';
import { PlayCircleOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';

import styles from './CodeToolbar.module.css';
import { useTheme } from '@mui/material';

interface CodeToolbarProps {
  onClickRun: () => void;
  id: string;
  processing: boolean;
  language: string;
}

const CodeToolbar: React.FC<CodeToolbarProps> = ({ onClickRun, id, processing, language }) => {
  const { deleteCell } = useNotebookContext();
  const theme = useTheme().palette.mode;
  return (
    <div
      id='code-toolbar'
      data-test='codeToolbarContainer'
      style={{
        backgroundColor: theme === 'dark' ? '#121212' : '#282A35',
        height: '40px',
        margin: 0,
        padding: 0,
        zIndex: 0,
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: '8px'
      }}>
      <Typography.Text
        data-test='language'
        type='secondary'
        style={{
          color: 'lightgray',
          position: 'absolute',
          left: '42px',
          fontSize: '0.8rem',
          opacity: 0.7
        }}>
        {language.toUpperCase()}
      </Typography.Text>
      <Tooltip title='Run code'>
        <Button
          data-test='runCodeButton'
          className={styles.toolbutton}
          disabled={processing}
          icon={
            processing ? (
              <LoadingOutlined data-test='loadingIndicator' />
            ) : (
              <PlayCircleOutlined data-test='runCodeButton' />
            )
          }
          onClick={onClickRun}
          type='text'
        />
      </Tooltip>
      <Tooltip title='Remove cell'>
        <Button
          data-test='removeCellButton'
          className={styles.toolbutton}
          disabled={processing}
          icon={<CloseOutlined />}
          onClick={() => deleteCell(id)}
          type='text'
        />
      </Tooltip>
    </div>
  );
};

export default CodeToolbar;
