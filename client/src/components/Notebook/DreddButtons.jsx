import { useState } from 'react';
import { useParams } from 'react-router';
import {
  Stack,
  PlayCircleOutlineTwoTone,
  Refresh,
  CircularProgress,
  Tooltip,
  IconButton
} from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { handleResetContext, handleRunAllCode } from '../../services/dreddExecutionService';
import { toast } from 'react-toastify';

const DreddButtons = ({ codeCells }) => {
  const { notebookMetadata } = useProviderContext();
  const { setAllRunning } = useNotebookContext();
  const { docID } = useParams();
  const [resetting, setResetting] = useState(false);
  const [running, setRunning] = useState(false);

  const handleRunAll = async () => {
    try {
      setRunning(true);
      setAllRunning(true);
      const orderedCells = codeCells.sort((a, b) => a.get('pos') - b.get('pos'));
      await handleRunAllCode(docID, orderedCells, notebookMetadata);
    } catch (error) {
      console.error(error);
    } finally {
      setAllRunning(false);
      setRunning(false);
    }
  };

  const handleReset = async () => {
    try {
      setResetting(true);
      setAllRunning(true);
      await handleResetContext(docID, notebookMetadata, codeCells);
      codeCells.forEach(c => c.get('outputMap').set('status', ''));
      toast.success('Context successfully reset');
    } catch (error) {
      console.error(error);
    } finally {
      setAllRunning(false);
      setResetting(false);
    }
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
            {running ? <CircularProgress size={20} sx={{ color: 'lightgray' }} /> : <PlayCircleOutlineTwoTone />}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

export default DreddButtons;
