export interface DreddCell {
  id: string;
  code: string;
}

export interface DreddResponse {
  cellId: string;
  output?: string;
  type: string;
}

export interface DreddSubmitResponse {
  submissionId: string;
}

export interface DreddStatusResponse {
  status: string;
  results: DreddResponse[];
}

export interface NotebookCell {
  cellId: string;
  code: string;
}
