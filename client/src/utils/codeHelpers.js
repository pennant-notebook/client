import { checkDreddStatus, resetContext, sendToDredd } from '../services/dreddExecutionService';

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
  const token = await sendToDredd(docID, cellId, editorContent.join('\n'));
  const response = await checkDreddStatus(token);
  const processedResponse = response[0].output;
  return processedResponse;
};

export const handleResetContext = async (docID, notebookMetadata, codeCells) => {
  console.log('resetting context for notebookID: ' + docID);
  await resetContext(docID);
  notebookMetadata.set('executionCount', 0);
  codeCells.forEach(cell => {
    cell.get('outputMap').set('stdout', '');
    cell.get('metaData').set('exeCount', 0);
  });
};

export const handleRunAllCode = async (docID, codeCells, notebookMetadata) => {
  console.log('RUNNING ALL CODE - BUTTON DISABLED');
  for (const cell of codeCells) {
    updateMetadata(cell.get('metaData'), notebookMetadata);
    const id = cell.get('id');
    const code = cell.get('content').toString();

    const token = await sendToDredd(docID, id, code);
    const response = await checkDreddStatus(token);
    if (response[0].output) {
      const outputMap = cell.get('outputMap');
      outputMap.set('stdout', response[0].output);
    }
  }
};
