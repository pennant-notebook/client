import { YTypes } from '~/utils/notebookHelpers';

export type CodeCellContent = YTypes['Text']
export type MarkdownCellContent = YTypes['XmlFragment']

/*
**ClientTypes.ts**
ClientType
UserState

**Cell Types**
CodeCellType
MarkdownCellType
CellType
CellMetadataType


**CellProps.ts**
CodeCellProps
MarkdownCellProps


**EditorTypes.ts**
CreateCodeEditorProps
MarkdownEditorProps

**ContentTypes.ts**
CodeCellContent
MarkdownCellContent

**NotebookTypes.ts**
NotebookMetadata
NotebookContextType
*/