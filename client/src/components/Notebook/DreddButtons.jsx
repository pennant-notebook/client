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
    const orderedCells = codeCells.sort((a, b) => a.get('pos') - b.get('pos'));
    handleRunAllCode(docID, orderedCells, notebookMetadata);

    setRunning(false);
  };

  const handleReset = async () => {
    setResetting(true);
    handleResetContext(docID, notebookMetadata, codeCells);
    setResetting(false);
  };

  const isDisabledRun = () => {
    return running || resetting || codeCells.length < 1;
  };

  const isDisabledReset = () => {
    return running || resetting || codeCells.length < 1;
  };

  return (
    <Stack direction='row' spacing={{ xs: 0, sm: 1, md: 2 }}>
      <Tooltip title='Reset'>
        <span>
          <IconButton disabled={isDisabledReset()} onClick={handleReset} color='inherit'>
            {resetting ? <CircularProgress size={24} sx={{ color: 'lightgray' }} /> : <Refresh />}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title='Run All'>
        <span>
          <IconButton disabled={isDisabledRun()} onClick={handleRunAll} color='inherit'>
            {running ? <CircularProgress size={24} sx={{ color: 'lightgray' }} /> : <PlayCircleOutlineTwoTone />}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

export default DreddButtons;
