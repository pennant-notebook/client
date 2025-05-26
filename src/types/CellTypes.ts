import { YMap } from "@/YjsTypes";

// export type CodeCellType = YMap & {
//   id: string;
//   type: string;
//   content: YText;
//   outputMap: YMap;
//   metaData: YMap;
// }

// export type MarkdownCellType = YMap & {
//   id: string;
//   type: string;
//   content: YXmlFragment;
// }

export type CodeCellType = YMap;
export type MarkdownCellType = YMap;
export type CellType = YMap;
export type CellMetadataType = YMap;
