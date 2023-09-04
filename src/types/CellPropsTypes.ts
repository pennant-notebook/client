import { YText, YXmlFragment } from '~/utils/notebookHelpers';
import { CodeCellType, MarkdownCellType } from './CellTypes';

export interface CodeCellProps {
  cellId: string;
  cell: CodeCellType;
  content: YText
}

export interface MarkdownCellProps {
  id: string;
  cell: MarkdownCellType;
  content: YXmlFragment;
}