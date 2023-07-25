import { useState } from 'react';
import { useParams } from 'react-router';
import { Stack, Refresh, CircularProgress, Tooltip, IconButton } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { handleResetContext, handleRunAllCode } from '../../services/dreddExecutionService';
import { toast } from 'react-toastify';
import PlayAllIcon from '../../assets/allplay.png';

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

  const iconSize = '24px';
  return (
    <Stack sx={{ alignItems: 'center' }} direction='row' spacing={1.5}>
      <Tooltip title='Reset Code Execution Context'>
        <span>
          <IconButton disabled={isDisabledReset()} onClick={handleReset} color='inherit'>
            {resetting ? (
              <CircularProgress size={24} sx={{ color: 'lightgray', fontSize: iconSize }} />
            ) : (
              <Refresh sx={{ fontSize: iconSize }} />
            )}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title='Run All Code Cells'>
        <span>
          <IconButton
            disabled={isDisabledRun()}
            onClick={handleRunAll}
            color='inherit'
            sx={{ borderRadius: '2px', opacity: isDisabledRun() ? '0.3' : '1', p: 1 }}>
            {running ? (
              <CircularProgress size={24} sx={{ color: 'lightgray', width: iconSize }} />
            ) : (
              <img src={PlayAllIcon} style={{ color: '#fff', width: iconSize }} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

export default DreddButtons;
