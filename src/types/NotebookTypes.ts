import { YTypes } from '~/utils/notebookHelpers';

export type NotebookMetadataType = YTypes['Map'] & {
  executionCount: number;
  title: string | YTypes['Text'];
};

export interface NotebookContextType {
  addCellAtIndex: (idx: number, type: string) => void;
  repositionCell: (cell: any, newIndex: number) => void;
  deleteCell: (id: string) => void;
  title: string;
  handleTitleChange: (newTitle: string) => void;
  allRunning: boolean;
  setAllRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NotebookType {
  docID: string;
  title?: string;
} 