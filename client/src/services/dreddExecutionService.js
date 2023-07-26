import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ENGINE_SERVER;

export const sendToDredd = async (notebookId, cellId, code) => {
  try {
    const result = await axios.post(`${BASE_URL}/api/submit`, {
      notebookId,
      cells: [
        {
          cellId,
          code
        }
      ]
    });
    return result.data.submissionId;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const checkDreddStatus = async token => {
  try {
    const response = await axios.get(`${BASE_URL}/api/status/${token}`);
    const statusId = response.data.status;
    if (statusId === 'critical error') {
      throw new Error('critical error');
    }

    if (statusId === 'pending') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return checkDreddStatus(token);
    } else {
      return response.data.results;
    }
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      if (error.response.status === 500) {
        console.log('server error');
      } else if (error.response.status === 400) {
        console.log('bad request');
      }
    }
    throw new Error(error.message);
  }
};

export const resetContext = async notebookId => {
  try {
    return await axios.post(`${BASE_URL}/api/reset/${notebookId}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const formatCellsForDredd = codeCells => {
  return codeCells.map(c => ({
    id: c.get('id'),
    code: c.get('content').toString()
  }));
};

export const updateMetadata = (cellMetadata, notebookMetadata) => {
  const numNotebookExecutions = notebookMetadata.get('executionCount');
  cellMetadata.set('exeCount', numNotebookExecutions + 1);
  notebookMetadata.set('executionCount', numNotebookExecutions + 1);
};

export const handleDredd = async (docID, cellId, editorContent) => {
  const token = await sendToDredd(docID, cellId, editorContent);
  const response = await checkDreddStatus(token);
  return response[0];
};

export const handleResetContext = async (docID, notebookMetadata, codeCells) => {
  console.log('💫 Resetting context for notebookID: ' + docID);
  await resetContext(docID);
  notebookMetadata.set('executionCount', 0);
  codeCells.forEach(cell => {
    const outputMap = cell.get('outputMap');
    outputMap.set('stdout', '');
    outputMap.set('status', '');
    const metadata = cell.get('metaData');
    metadata.set('exeCount', 0);
  });
};

export const handleRunAllCode = async (docID, codeCells, notebookMetadata) => {
  console.log('🥁 Running All Code');
  await handleResetContext(docID, notebookMetadata, codeCells);

  for (const cell of codeCells) {
    const id = cell.get('id');
    const code = cell.get('content').toString();
    const outputMap = cell.get('outputMap');
    const token = await sendToDredd(docID, id, code);
    const response = await checkDreddStatus(token);

    if (response[0].output) {
      outputMap.set('stdout', response[0].output);
    }

    outputMap.set('status', response[0].type);

    updateMetadata(cell.get('metaData'), notebookMetadata, true);
  }
};
