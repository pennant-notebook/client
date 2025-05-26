import { NotebookType } from '@/NotebookTypes';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Tree, Tooltip, Switch } from 'antd';
import { useState } from 'react';
import { createDoc } from '~/services/dynamoPost';
import { useTheme } from '~/utils/MuiImports';

import TreeNotebook from './TreeNotebook';
import './TreeNotebook.css';

interface NotebookTreeViewProps {
  username: string;
  notebooks?: NotebookType[];
  refetch: () => void;
  handleSelectedDocId: (docId: string) => void;
}

export default function NotebookTreeView({
  username,
  notebooks = [],
  refetch,
  handleSelectedDocId
}: NotebookTreeViewProps) {
  const [expanded, setExpanded] = useState<string[]>(['js', 'py']);
  const theme = useTheme().palette.mode;
  const {
    custom: { toggleTheme }
  } = useTheme();

  const handleCreateNotebook = async (language: string) => {
    const newNotebook = await createDoc(username, language);
    if (newNotebook?.docID) {
      const docID = newNotebook.docID;
      handleSelectedDocId(docID);
      refetch();
    }
  };

  const jsNotebooks = notebooks.filter(nb => nb.language === 'javascript');
  const pyNotebooks = notebooks.filter(nb => nb.language === 'python');

  const generateTreeData = (data: NotebookType[], language: string) => {
    return data.map((item, index) => ({
      title: (
        <TreeNotebook
          notebook={item}
          username={username}
          index={index}
          handleSelectedDocId={handleSelectedDocId}
          language={language}
        />
      ),
      key: item.docID
    }));
  };

  const treeData = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: '6px' }}>JavaScript</span>
          <Tooltip title='Create JavaScript Notebook'>
            <PlusCircleOutlined
              onClick={e => {
                e.stopPropagation();
                handleCreateNotebook('javascript');
              }}
              style={{ cursor: 'pointer', color: '#595959' }}
              className='plus-icon'
            />
          </Tooltip>
        </div>
      ),
      key: 'js',
      children: generateTreeData(jsNotebooks, 'javascript')
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: '6px' }}>Python</span>
          <Tooltip title='Create Python Notebook'>
            <PlusCircleOutlined
              onClick={e => {
                e.stopPropagation();
                handleCreateNotebook('python');
              }}
              style={{ cursor: 'pointer', color: '#595959' }}
              className='plus-icon'
            />
          </Tooltip>
        </div>
      ),
      key: 'py',
      children: generateTreeData(pyNotebooks, 'python')
    }
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0px 12px', justifyContent: 'space-between' }}>
        <h3>Workspace</h3>
        <Switch
          checkedChildren='Dark'
          unCheckedChildren='Light'
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
      </div>
      <Tree
        defaultExpandAll
        expandedKeys={expanded}
        onExpand={expandedKeys => {
          setExpanded(expandedKeys.map(key => String(key)));
        }}
        treeData={treeData}
        style={{
          backgroundColor: theme === 'dark' ? '#121212' : '#fafafa',
          color: theme === 'dark' ? '#fff' : '#000'
        }}
      />
    </>
  );
}
