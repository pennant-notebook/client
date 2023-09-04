import { YTypes } from '~/utils/notebookHelpers';
import { CodeCellType, MarkdownCellType } from './CellTypes';

export interface CodeCellProps {
  cellId: string;
  cell: CodeCellType;
  content: YTypes['Text'];
}

export interface MarkdownCellProps {
  id: string;
  cell: MarkdownCellType;
  content: YTypes['XmlFragment'];
}