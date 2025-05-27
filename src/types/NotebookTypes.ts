import { CellType } from "@/Cell";
import { Dispatch, SetStateAction } from "react";
import { YMap } from "./YjsTypes";

export type NotebookMetadataType = YMap;
// & {
//   executionCount: number;
//   title: string | YText;
// };

export interface NotebookContextType {
  addCellAtIndex: (idx: number, type: string) => void;
  repositionCell: (cell: CellType, newIndex: number) => void;
  deleteCell: (id: string) => void;
  allRunning: boolean;
  setAllRunning: Dispatch<SetStateAction<boolean>>;
}

export interface NotebookType {
  docID: string;
  title?: string;
  language?: string;
  cells?: CellType[];
}
