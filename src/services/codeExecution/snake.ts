import axios, { AxiosResponse } from 'axios';
import { YMap } from '~/utils/notebookHelpers';

const BASE_URL = import.meta.env.VITE_SNAKE_SERVER as string;

interface Cell {
  cellId: string;
  code: string;
}

interface SnakeCell {
  id: string;
  code: string;
}

interface SnakeResponse {
  cellId: string;
  output?: string;
  type: string;
}

export const sendToSnake = async (notebookId: string, cellId: string, code: string): Promise<string> => {
  try {
    const result: AxiosResponse<any> = await axios.post(`${BASE_URL}/api/submit`, {
      notebookId,
      cells: [
        {
          cellId,
          code
        }
      ]
    });
    return result.data.submissionId;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const sendManyToSnake = async (notebookId: string, cells: Cell[]): Promise<string> => {
  try {
    const result: AxiosResponse<any> = await axios.post(`${BASE_URL}/api/submit`, {
      notebookId,
      cells
    });
    return result.data.submissionId;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const checkSnakeStatus = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/status/${token}`);
    const statusId = response.data.status;
    if (statusId === 'critical error') {
      throw new Error('critical error');
    }

    if (statusId === 'pending') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return checkSnakeStatus(token);
    } else {
      return response.data.results;
    }
  } catch (error: any) {
    if (error.hasOwnProperty('response')) {
      if (error.response.status === 500) {
        console.log('server error');
      } else if (error.response.status === 400) {
        console.log('bad request');
      }
    }
    throw new Error(error.message);
  }
};

export const resetContext = async (notebookId: string) => {
  try {
    return await axios.post(`${BASE_URL}/api/reset/${notebookId}`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const formatCellsForSnake = (codeCells: YMap[]): SnakeCell[] => {
  return codeCells.map(c => ({
    id: c.get('id'),
    code: c.get('content').toString()
  }));
};

export const updateMetadata = (cellMetadata: YMap, notebookMetadata: YMap): void => {
  const numNotebookExecutions = notebookMetadata.get('executionCount');
  cellMetadata.set('exeCount', numNotebookExecutions + 1);
  notebookMetadata.set('executionCount', numNotebookExecutions + 1);
};

export const handleSnake = async (docID: string, cellId: string, editorContent: string): Promise<SnakeResponse> => {
  const token = await sendToSnake(docID, cellId, editorContent);
  const response = await checkSnakeStatus(token);
  console.log(response)
  return response;
};

export const handleResetContext = async (docID: string, notebookMetadata: YMap, codeCells: YMap[]): Promise<void> => {
  console.log('💫 Resetting execution context');
  await resetContext(docID);
  notebookMetadata.set('executionCount', 0);
  codeCells.forEach(cell => {
    const outputMap = cell.get('outputMap');
    outputMap.set('stdout', '');
    outputMap.set('status', '');
    const metadata = cell.get('metaData');
    metadata.set('exeCount', 0);
  });
};

export const handleRunAllCode = async (docID: string, codeCells: YMap[], notebookMetadata: YMap): Promise<void> => {
  console.log('🥁 Running All Code');
  await handleResetContext(docID, notebookMetadata, codeCells);

  const snakeCells = codeCells.map(cell => {
    const cellId = cell.get('id');
    const code = cell.get('content').toString();
    return { cellId, code };
  });

  const token = await sendManyToSnake(docID, snakeCells);
  const response = await checkSnakeStatus(token);
  console.log(response);
  for (const returnedCell of response) {
    const cell = codeCells.find(c => c.get('id') === returnedCell.cellId);
    if (cell) {
      const outputMap = cell.get('outputMap');
      if (returnedCell.output) {
        outputMap.set('stdout', returnedCell.output);
      }
      outputMap.set('status', returnedCell.type);
      updateMetadata(cell.get('metaData'), notebookMetadata);
    }
  }
};
