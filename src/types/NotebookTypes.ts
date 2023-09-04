import React from 'react';
import { YText, YMap } from '~/utils/notebookHelpers';

export type NotebookMetadataType = YMap & {
  executionCount: number;
  title: string | YText;
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