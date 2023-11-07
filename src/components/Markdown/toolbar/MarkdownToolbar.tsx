import React from 'react';
import { Tooltip, Button, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import useNotebookContext from '~/contexts/NotebookContext';
import styles from './MarkdownToolbar.module.css';

interface MarkdownToolbarProps {
  id: string;
  cellTheme: string;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ id, cellTheme }) => {
  const { deleteCell } = useNotebookContext();

  const buttonColor = cellTheme === 'dark' ? '#e1e1ea' : '#2c3032';

  return (
    <div className={`${styles['markdown-toolbar']} ${styles[cellTheme]}`}>
      <div className={styles.toolbarRow}>
        <Typography.Text type='secondary' style={{ color: 'lightgray', position: 'absolute', left: '12px' }}>
          MARKDOWN
        </Typography.Text>
        <Tooltip title='Remove cell' mouseEnterDelay={0} mouseLeaveDelay={0}>
          <Button
            type='text'
            icon={<CloseOutlined style={{ color: buttonColor }} />}
            onClick={() => deleteCell(id)}
            className={styles.toolbarButton}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default MarkdownToolbar;
