import { sendManyToDredd, checkDreddStatus, resetContext, sendToDredd } from '../services/dreddExecutionService';

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

export const updateEditorHeight = (editor, setEditorHeight) => {
  const resize = () => {
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = Math.max(editor.getModel().getLineCount(), 3);
    setEditorHeight(`${lineCount * lineHeight}px`);
  };
  resize();
  editor.onDidContentSizeChange(resize);
};

export const editorOptions = {
  minimap: { enabled: false },
  scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
  scrollBeyondLastLine: false,
  cursorBlinking: 'smooth',
  lineHeight: 24,
  fontSize: 14,
  fontFamily: 'Fira Code',
  wordWrap: 'on',
  wrappingStrategy: 'advanced',
  overviewRulerLanes: 0
};

export const handleRunAllCode = async (doc, docID, codeCells) => {
  const codeCellsForDredd = formatCellsForDredd(codeCells);
  const token = await sendManyToDredd(docID, codeCellsForDredd);
  const response = await checkDreddStatus(token);

  response.forEach(codeCell => {
    const cell = doc
      .getArray('cells')
      .toArray()
      .find(c => c.get('id') === codeCell['id']);
    if (cell && codeCell.output) {
      const outputMap = cell.get('outputMap');
      outputMap.set('stdout', codeCell.output);
    }
  });
};
