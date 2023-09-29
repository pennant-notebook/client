import { NotebookType } from '@/NotebookTypes';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { Add, Box, Typography, IconButton, Tooltip } from '~/utils/MuiImports';
import { CloseSquare, MinusSquare, PlusSquare, StyledTreeItem } from '~/components/UI/StyledTreeComponents';
import { useState } from 'react';
import TreeNotebook from './TreeNotebook';
import { createDoc } from '~/services/dynamoPost';
import IconJS from '~/components/Landing/assets/javascript.svg';
import IconPY from '~/assets/python.svg';
import { useNavigate } from 'react-router';
// import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

interface NotebookTreeViewProps {
  username: string;
  notebooks?: NotebookType[];
  refetch: () => void;
}

export default function NotebookTreeView({ username, notebooks = [], refetch }: NotebookTreeViewProps) {
  const [expanded, setExpanded] = useState<string[]>(['js', 'py']);
  const navigate = useNavigate();

  const jsNotebooks = notebooks.filter(nb => nb.language === 'javascript');
  const pyNotebooks = notebooks.filter(nb => nb.language === 'python');

  const handleCreateNotebook = async (language: string) => {
    const newNotebook = await createDoc(username, language);
    const docID = newNotebook.docID;
    navigate(`/${username}/${docID}`);
  };

  return (
    <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 250 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 1, color: 'gray' }}>
        <Typography variant='h6'>Workspace</Typography>
      </Box>
      <TreeView
        aria-label='customized'
        expanded={expanded}
        onNodeToggle={(event, nodeIds) => {
          setExpanded(nodeIds as string[]);
        }}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        sx={{ overflowX: 'hidden', overflowY: 'hidden' }}>
        <StyledTreeItem
          nodeId='js'
          label={
            <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              <img src={IconJS} alt='JS Icon' width={24} style={{ marginRight: '6px' }} />
              <span>JavaScript</span>
              <Tooltip title='Create New JavaScript Notebook' enterDelay={1000} enterNextDelay={1000}>
                <IconButton sx={{ ml: 'auto', borderRadius: '5px' }} onClick={() => handleCreateNotebook('javascript')}>
                  <Add />
                </IconButton>
              </Tooltip>
            </div>
          }>
          {jsNotebooks.map((notebook, idx) => (
            <TreeNotebook key={notebook.docID} index={idx} notebook={notebook} username={username} refetch={refetch} />
          ))}
        </StyledTreeItem>
        <StyledTreeItem
          nodeId='py'
          label={
            <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              <img src={IconPY} alt='PY Icon' width={24} style={{ marginRight: '6px' }} />
              <span>Python</span>
              <Tooltip title='Create New Python Notebook' enterDelay={1000} enterNextDelay={1000}>
                <IconButton sx={{ ml: 'auto', borderRadius: '5px' }} onClick={() => handleCreateNotebook('python')}>
                  <Add />
                </IconButton>
              </Tooltip>
            </div>
          }>
          {pyNotebooks.map((notebook, idx) => (
            <TreeNotebook key={notebook.docID} index={idx} notebook={notebook} username={username} refetch={refetch} />
          ))}
        </StyledTreeItem>
      </TreeView>
    </Box>
  );
}
