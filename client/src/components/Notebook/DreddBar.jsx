import { Stack, IconButton, PlayCircleOutlineTwoTone, Refresh, CircularProgress } from '../../utils/MuiImports';
import { handleResetContext, handleRunAllCode } from '../../utils/codeHelpers';
import useProviderContext from '../../contexts/ProviderContext';
import { useState } from 'react';

const DreddBar = ({ codeCells }) => {
  const { doc, docID, notebookMetadata } = useProviderContext();
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
    handleRunAllCode(doc, docID, codeCells);
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
    <Stack direction='row'>
      {docID && (
        <>
          <button
            className='button-4'
            onClick={handleReset}
            disabled={resetting || running}
            style={{ color: '#36454f', borderRadius: '8px', opacity: resetting ? 0.9 : 0.6 }}>
            {resetting ? (
              <CircularProgress size={36} sx={{ color: 'lightgray' }} />
            ) : (
              <Refresh sx={{ fontSize: '36px' }} />
            )}
          </button>
          <button
            className='button-4'
            onClick={handleRunAll}
            disabled={resetting || running}
            style={{ color: '#36454f', borderRadius: '8px', opacity: running ? 0.9 : 0.6 }}>
            {running ? (
              <CircularProgress size={36} sx={{ color: 'lightgray' }} />
            ) : (
              <PlayCircleOutlineTwoTone sx={{ fontSize: '36px' }} />
            )}
          </button>
        </>
      )}
    </Stack>
  );
};

export default DreddBar;
