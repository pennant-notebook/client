import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Stack, Refresh, CircularProgress, Tooltip, IconButton } from '../../utils/MuiImports';
import useProviderContext from '../../contexts/ProviderContext';
import { handleResetContext, handleRunAllCode } from '../../services/dreddExecutionService';
import { toast } from 'react-toastify';
import PlayAllIcon from '../../assets/allplay.png';
import styles from './DreddButtons.module.css';
import { CodeCellType, ProviderContextType } from '~/utils/notebookHelpers';

interface DreddButtonsProps {
  codeCells: CodeCellType[];
}

const DreddButtons: React.FC<DreddButtonsProps> = ({ codeCells }) => {
  const { notebookMetadata } = useProviderContext() as ProviderContextType;
  const { docID } = useParams();
  const [resetting, setResetting] = useState(false);
  const [running, setRunning] = useState(false);

  const handleRunAll = async () => {
    const orderedCells = codeCells.sort((a, b) => a.get('pos') - b.get('pos'));

    try {
      setRunning(true);
      orderedCells.forEach(cell => cell.get('metaData').set('isRunning', true));
      if (!docID) return;
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
      if (!docID) return;

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
          <IconButton
            className={`${styles['navbar-actions']} ${styles['navbar-actions.reset']}`}
            disabled={isDisabledReset()}
            onClick={handleReset}
            color='inherit'>
            {resetting ? <CircularProgress size={24} sx={{ color: 'lightgray', fontSize: iconSize }} /> : <Refresh />}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title='Run All Code Cells' enterDelay={1000} enterNextDelay={1000}>
        <span>
          <IconButton
            className={`${styles['navbar-actions']} ${styles['navbar-actions.run']}`}
            disabled={isDisabledRun()}
            onClick={handleRunAll}
            color='inherit'>
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
