import { YMap } from '~/utils/notebookHelpers';

export interface CodeCellProps {
  cellId: string;
  cell: YMap;
}

export interface MarkdownCellProps {
  id: string;
  cell: YMap;
}