import { useState } from 'react';
import { useParams } from 'react-router';
import { Stack, Refresh, CircularProgress, Tooltip, IconButton } from '../../utils/MuiImports';
import useNotebookContext from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { handleResetContext, handleRunAllCode } from '../../services/dreddExecutionService';
import { toast } from 'react-toastify';
import PlayAllIcon from '../../assets/allplay.png';
import { codeTestingPromise } from '../../utils/notebookHelpers';

const DreddButtons = ({ codeCells }) => {
  const { notebookMetadata } = useProviderContext();
  const { docID } = useParams();
  const [resetting, setResetting] = useState(false);
  const [running, setRunning] = useState(false);

  const handleRunAll = async () => {
    const orderedCells = codeCells.sort((a, b) => a.get('pos') - b.get('pos'));

    try {
      setRunning(true);
      orderedCells.forEach(cell => cell.get('metaData').set('isRunning', true));

      // await codeTestingPromise();
      await handleRunAllCode(docID, orderedCells, notebookMetadata);
    } catch (error) {
      console.error(error);
    } finally {
      orderedCells.forEach(cell => cell.get('metaData').set('isRunning', false));
      setRunning(false);
    }
  };

  const handleReset = async () => {
    try {
      setResetting(true);
      codeCells.forEach(c => {
        c.get('metaData').set('isRunning', true);
        c.get('outputMap').set('status', '');
      });
      // await codeTestingPromise();

      await handleResetContext(docID, notebookMetadata, codeCells);

      toast.success('Context successfully reset');
    } catch (error) {
      console.error(error);
    } finally {
      codeCells.forEach(c => c.get('metaData').set('isRunning', false));
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
      <Tooltip title='Reset Code Execution Context' enterDelay={1000} enterNextDelay={1000}>
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

      <Tooltip title='Run All Code Cells' enterDelay={1000} enterNextDelay={1000}>
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
