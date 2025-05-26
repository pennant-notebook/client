export interface LSPPosition {
  line: number;
  character: number;
}

export interface LSPRange {
  start: LSPPosition;
  end: LSPPosition;
}

export interface LSPLocation {
  uri: string;
  range: LSPRange;
}

export interface LSPCompletionItem {
  label: string;
  kind?: number;
  detail?: string;
  documentation?: string | MarkupContent;
  insertText?: string;
  textEdit?: TextEdit;
}

export interface TextEdit {
  range: LSPRange;
  newText: string;
}

export interface MarkupContent {
  kind: "plaintext" | "markdown";
  value: string;
}

export interface HoverResult {
  contents: string | MarkupContent | (string | MarkupContent)[];
  range?: LSPRange;
}

export interface ServerResponse {
  server_id: string;
  status: string;
}

export interface DocumentResponse {
  status: string;
  document_uri: string;
}
