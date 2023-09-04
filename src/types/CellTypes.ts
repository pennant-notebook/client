import { YTypes } from '~/utils/notebookHelpers';

export type CodeCellType = YTypes['Map'] & {
  id: string;
  type: string;
  content: YTypes['Text'];
  outputMap: YTypes['Map'];
  metaData: YTypes['Map'];
}

export type MarkdownCellType = YTypes['Map'] & {
  id: string;
  type: string;
  content: YTypes['XmlFragment'];
}

export type CellType = CodeCellType | MarkdownCellType;

export type CellMetadataType = YTypes['Map'] & {
  isRunning: boolean;
  exeCount: number;
};