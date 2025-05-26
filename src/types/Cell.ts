import { YMap } from "@/YjsTypes";

/**
 * Represents a cell in a notebook
 */
export interface CellBase {
  id: string;
  type: "code" | "markdown";
  language?: string;
  pos?: number;
  theme?: string;
}

/**
 * Represents a code cell's data structure
 */
export interface CodeCellData extends CellBase {
  type: "code";
  content: string;
  outputMap: {
    stdout?: string;
    status?: string;
  };
  metaData: {
    isRunning: boolean;
    exeCount: number;
  };
}

/**
 * Represents a markdown cell's data structure
 */
export interface MarkdownCellData extends CellBase {
  type: "markdown";
  content: string;
}

/**
 * Union type for any cell data
 */
export type CellData = CodeCellData | MarkdownCellData;

/**
 * Type for YMap cells with any additional properties
 */
export interface YMapCellData extends Record<string, any> {
  id: string;
  type: string;
  pos?: number;
  theme?: string;
  language?: string;
  content?: string;
  outputMap?: any;
  metaData?: any;
}

/**
 * Types for working with YMap-based cells
 */
export type CodeCellType = YMap<CodeCellData>;
export type MarkdownCellType = YMap<MarkdownCellData>;
export type CellType = YMap<CellData>;
export type CellMetadataType = YMap;
