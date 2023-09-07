import { CodeCellType, MarkdownCellType } from './CellTypes';

export interface CodeCellProps {
  cellId: string;
  cell: CodeCellType;
}

export interface MarkdownCellProps {
  id: string;
  cell: MarkdownCellType;
}