import { NotebookType } from '@/NotebookTypes';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { Add, Box, Typography, IconButton, Tooltip } from '~/utils/MuiImports';
import { MinusSquare, PlusSquare, StyledTreeItem } from '~/components/UI/StyledTreeComponents';
import { useState } from 'react';
import TreeNotebook from './TreeNotebook';
import { createDoc } from '~/services/dynamoPost';
import IconJS from '~/components/Landing/assets/javascript.svg';
import IconPY from './IconPY.png';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

import { useNavigate } from 'react-router';

interface NotebookTreeViewProps {
  username: string;
  notebooks?: NotebookType[];
  refetch: () => void;
}

export default function NotebookTreeView({ username, notebooks = [], refetch }: NotebookTreeViewProps) {
  const [expanded, setExpanded] = useState<string[]>(['js', 'py']);
  const [globalSortOrder, setGlobalSortOrder] = useState<'asc' | 'desc'>('asc');

  const navigate = useNavigate();

  const jsNotebooks = notebooks.filter(nb => nb.language === 'javascript');
  const pyNotebooks = notebooks.filter(nb => nb.language === 'python');

  const toggleGlobalSortOrder = () => {
    setGlobalSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortNotebooks = (notebooks: NotebookType[]) => {
    return notebooks.sort((a, b) => {
      const aTitle = a.title ?? 'Untitled';
      const bTitle = b.title ?? 'Untitled';
      return globalSortOrder === 'asc' ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
    });
  };

  const sortedJsNotebooks = sortNotebooks(jsNotebooks);
  const sortedPyNotebooks = sortNotebooks(pyNotebooks);

  const handleCreateNotebook = async (language: string) => {
    const newNotebook = await createDoc(username, language);
    const docID = newNotebook.docID;
    navigate(`/${username}/${docID}`);
  };

  return (
    <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 250 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 1, color: 'gray' }}>
        <Typography variant='h6'>Workspace</Typography>
        <Tooltip title='Sort All Notebooks' enterDelay={1000} enterNextDelay={1000}>
          <IconButton sx={{ ml: 'auto', mr: 1, borderRadius: '5px' }} onClick={toggleGlobalSortOrder}>
            {globalSortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
          </IconButton>
        </Tooltip>
      </Box>
      <TreeView
        aria-label='customized'
        expanded={expanded}
        onNodeToggle={(event, nodeIds) => {
          setExpanded(nodeIds as string[]);
        }}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        sx={{ overflowX: 'hidden', overflowY: 'hidden' }}>
        <StyledTreeItem
          nodeId='js'
          label={
            <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              <img src={IconJS} alt='JS Icon' width={24} style={{ marginRight: '6px' }} />
              <span style={{ fontFamily: 'Inter' }}>JavaScript</span>
              <Tooltip title='Create New JavaScript Notebook' enterDelay={1000} enterNextDelay={1000}>
                <IconButton sx={{ ml: 'auto', borderRadius: '5px' }} onClick={() => handleCreateNotebook('javascript')}>
                  <Add />
                </IconButton>
              </Tooltip>
            </div>
          }>
          {sortedJsNotebooks.map((notebook, idx) => (
            <TreeNotebook key={notebook.docID} index={idx} notebook={notebook} username={username} refetch={refetch} />
          ))}
        </StyledTreeItem>
        <StyledTreeItem
          nodeId='py'
          label={
            <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              <img src={IconPY} alt='PY Icon' width={24} style={{ marginRight: '6px' }} />
              <span style={{ fontFamily: 'Inter' }}>Python</span>
              <Tooltip title='Create New Python Notebook' enterDelay={1000} enterNextDelay={1000}>
                <IconButton sx={{ ml: 'auto', borderRadius: '5px' }} onClick={() => handleCreateNotebook('python')}>
                  <Add />
                </IconButton>
              </Tooltip>
            </div>
          }>
          {sortedPyNotebooks.map((notebook, idx) => (
            <TreeNotebook key={notebook.docID} index={idx} notebook={notebook} username={username} refetch={refetch} />
          ))}
        </StyledTreeItem>
      </TreeView>
    </Box>
  );
}
