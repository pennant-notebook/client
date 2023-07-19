import { AppBar, Toolbar, IconButton, Box, Typography } from '../../utils/MuiImports';
import { Stack, PlayCircleOutlineTwoTone, Refresh, CircularProgress, Tooltip } from '../../utils/MuiImports';
import { handleResetContext, handleRunAllCode } from '../../utils/codeHelpers';
import useProviderContext from '../../contexts/ProviderContext';
import { useState } from 'react';
import { useParams } from 'react-router';

const DreddButtons = ({ codeCells }) => {
  const { notebookMetadata } = useProviderContext();
  const { docID } = useParams();
  const [resetting, setResetting] = useState(false);
  const [running, setRunning] = useState(false);

  const handleRunAll = async () => {
    setRunning(true);
    await new Promise(resolve => {
      setTimeout(() => {
        console.log('hadouken');
        resolve();
      }, 2000);
    });
    handleRunAllCode(docID, codeCells, notebookMetadata);
    setRunning(false);
  };

  const handleReset = async () => {
    setResetting(true);
    await new Promise(resolve => {
      setTimeout(() => {
        console.log('hadouken');
        resolve();
      }, 2000);
    });
    handleResetContext(docID, notebookMetadata, codeCells);
    setResetting(false);
  };
  return (
    <Stack direction='row' spacing={2}>
      <Tooltip title='Reset'>
        <span>
          <IconButton disabled={resetting || running} onClick={handleReset} color='inherit'>
            {resetting ? <CircularProgress size={24} sx={{ color: 'lightgray' }} /> : <Refresh />}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title='Run All'>
        <span>
          <IconButton disabled={resetting || running} onClick={handleRunAll} color='inherit'>
            {running ? <CircularProgress size={24} sx={{ color: 'lightgray' }} /> : <PlayCircleOutlineTwoTone />}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

export default DreddButtons;
