export const updateMetadata = (cellMetadata, notebookMetadata) => {
  const numNotebookExecutions = notebookMetadata.get('executionCount');
  cellMetadata.set('exeCount', numNotebookExecutions + 1);
  notebookMetadata.set('executionCount', numNotebookExecutions + 1);
};

export const updateEditorHeight = (editor, setEditorHeight) => {
  const resize = () => {
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = editor.getModel().getLineCount();
    setEditorHeight(`${lineCount * lineHeight}px`);
  };
  resize();
  editor.onDidContentSizeChange(resize);
};

export const editorOptions = {
  cursorBlinking: 'smooth',
  minimap: { enabled: false },
  scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
  scrollBeyondLastLine: false,
  lineHeight: 24,
  fontSize: 14,
  fontFamily: 'Fira Code',
  wordWrap: 'on',
  wrappingStrategy: 'advanced',
  overviewRulerLanes: 0
};
