import { NotebookType } from '@/NotebookTypes';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { Add, Box, Typography, IconButton, Tooltip, useTheme } from '~/utils/MuiImports';
import { MinusSquare, PlusSquare, StyledTreeItem } from '~/components/UI/StyledTreeComponents';
import { useState } from 'react';
import TreeNotebook from './TreeNotebook';
import { createDoc } from '~/services/dynamoPost';
import IconPY from './assets/pyfolder.png';
import IconJS from './assets/jsfolder.png';
import AzIconWhite from './assets/az-white.png';
import AzIcon from './assets/az.png';

interface NotebookTreeViewProps {
  username: string;
  notebooks?: NotebookType[];
  refetch: () => void;
  setSelectedDocId: (docId: string) => void;
}

export default function NotebookTreeView({
  username,
  notebooks = [],
  refetch,
  setSelectedDocId
}: NotebookTreeViewProps) {
  const [expanded, setExpanded] = useState<string[]>(['js', 'py']);
  const [globalSortOrder, setGlobalSortOrder] = useState<'asc' | 'desc'>('asc');
  const theme = useTheme().palette.mode;

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
    setSelectedDocId(docID);
    refetch();

    // navigate(`/${username}/${docID}`);
  };

  const treeFont = 'Lato';

  const AZIcon = theme === 'dark' ? AzIconWhite : AzIcon;

  return (
    <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 268 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          ml: 1,
          color: 'gray'
        }}>
        <Typography variant='h6' sx={{ fontFamily: treeFont, ml: 1 }}>
          Workspace
        </Typography>
        <Tooltip title='Sort All Notebooks' enterDelay={1000} enterNextDelay={1000}>
          <IconButton
            sx={{ ml: 1.5, borderRadius: '5px', width: '28px', height: '28px', opacity: 0.7 }}
            onClick={toggleGlobalSortOrder}>
            {globalSortOrder === 'asc' ? (
              <img src={AZIcon} style={{ width: '20px', height: '16px', transform: 'scaleY(-1)' }} />
            ) : (
              <img src={AZIcon} style={{ width: '20px', height: '16px' }} />
            )}
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
              <img src={IconJS} alt='JS Icon' width={20} style={{ marginRight: '6px' }} />
              <span style={{ fontFamily: treeFont, fontSize: '0.95rem' }}>JavaScript</span>
              <Tooltip title='Create New JavaScript Notebook' enterDelay={1000} enterNextDelay={1000}>
                <IconButton
                  sx={{ ml: 'auto', borderRadius: '5px', width: '28px', height: '28px' }}
                  onClick={() => handleCreateNotebook('javascript')}>
                  <Add />
                </IconButton>
              </Tooltip>
            </div>
          }>
          {sortedJsNotebooks.map((notebook, idx) => (
            <TreeNotebook
              key={notebook.docID}
              index={idx}
              notebook={notebook}
              username={username}
              setSelectedDocId={setSelectedDocId}
            />
          ))}
        </StyledTreeItem>
        <StyledTreeItem
          nodeId='py'
          label={
            <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              <img src={IconPY} alt='PY Icon' width={20} style={{ marginRight: '6px' }} />
              <span style={{ fontFamily: treeFont, fontSize: '0.95rem' }}>Python</span>
              <Tooltip title='Create New Python Notebook' enterDelay={1000} enterNextDelay={1000}>
                <IconButton
                  sx={{ ml: 'auto', borderRadius: '5px', width: '28px', height: '28px' }}
                  onClick={() => handleCreateNotebook('python')}>
                  <Add />
                </IconButton>
              </Tooltip>
            </div>
          }>
          {sortedPyNotebooks.map((notebook, idx) => (
            <TreeNotebook
              key={notebook.docID}
              index={idx}
              notebook={notebook}
              username={username}
              setSelectedDocId={setSelectedDocId}
            />
          ))}
        </StyledTreeItem>
      </TreeView>
    </Box>
  );
}
