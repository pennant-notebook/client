import { NotebookType } from '@/NotebookTypes';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Tree, Tooltip } from 'antd';
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
  const [globalSortOrder, setGlobalSortOrder] = useState<'asc' | 'desc'>('asc');
  const theme = useTheme().palette.mode;

  const sortNotebooks = (notebooks: NotebookType[]) => {
    return notebooks.sort((a, b) => {
      const aTitle = a.title ?? 'Untitled';
      const bTitle = b.title ?? 'Untitled';
      return globalSortOrder === 'asc' ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
    });
  };

  const handleCreateNotebook = async (language: string) => {
    const newNotebook = await createDoc(username, language);
    const docID = newNotebook.docID;
    handleSelectedDocId(docID);
    refetch();
  };

  const jsNotebooks = notebooks.filter(nb => nb.language === 'javascript');
  const pyNotebooks = notebooks.filter(nb => nb.language === 'python');
  const sortedJsNotebooks = sortNotebooks(jsNotebooks);
  const sortedPyNotebooks = sortNotebooks(pyNotebooks);

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
      children: generateTreeData(sortedJsNotebooks, 'javascript')
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
      children: generateTreeData(sortedPyNotebooks, 'python')
    }
  ];

  return (
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
  );
}
