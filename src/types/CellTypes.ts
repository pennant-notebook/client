import { YMap, YText, YXmlFragment } from '~/utils/notebookHelpers';

export type CodeCellType = YMap & {
  id: string;
  type: string;
  content: YText;
  outputMap?: YMap;
  metaData?: YMap;
}

export type MarkdownCellType = YMap & {
  id: string;
  type: string;
  content: YXmlFragment;
}

export type CellType = CodeCellType | MarkdownCellType;

export type CellMetadataType = YMap & {
  isRunning: boolean;
  exeCount: number;
};