import axios, { AxiosResponse } from 'axios';
import { YMap } from '~/utils/notebookHelpers';

const BASE_URL = import.meta.env.VITE_ENGINE_SERVER as string;
const PYTHON_URL = import.meta.env.VITE_SNAKE_SERVER as string;

interface Cell {
  cellId: string;
  code: string;
}

interface DreddCell {
  id: string;
  code: string;
}

interface DreddResponse {
  cellId: string;
  output?: string;
  type: string;
}

export const sendToDredd = async (language: string, notebookId: string, cellId: string, code: string): Promise<string> => {
  const URL = language === 'python' ? PYTHON_URL : BASE_URL;
  try {
    const result: AxiosResponse<any> = await axios.post(`${URL}/api/submit`, {
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

export const sendManyToDredd = async (notebookId: string, cells: Cell[], lang: string): Promise<string> => {
  const URL = lang === 'python' ? PYTHON_URL : BASE_URL;
  try {
    const result: AxiosResponse<any> = await axios.post(`${URL}/api/submit`, {
      notebookId,
      cells
    });
    return result.data.submissionId;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const checkDreddStatus = async (token: string, lang: string): Promise<any> => {
  const URL = lang === 'python' ? PYTHON_URL : BASE_URL;

  try {
    const response = await axios.get(`${URL}/api/status/${token}`);
    const statusId = response.data.status;
    if (statusId === 'critical error') {
      throw new Error('critical error');
    }

    if (statusId === 'pending') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return checkDreddStatus(token, lang);
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

export const resetContext = async (notebookId: string, lang: string) => {
  const URL = lang === 'python' ? PYTHON_URL : BASE_URL;
  try {
    return await axios.post(`${URL}/api/reset/${notebookId}`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const formatCellsForDredd = (codeCells: YMap[]): DreddCell[] => {
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

export const handleDredd = async (language: string, docID: string, cellId: string, editorContent: string): Promise<DreddResponse> => {
  const token = await sendToDredd(language, docID, cellId, editorContent);
  const response = await checkDreddStatus(token, language);
  return response[0];
};

export const handleResetContext = async (docID: string, notebookMetadata: YMap, codeCells: YMap[]): Promise<void> => {
  const lang = notebookMetadata.get('language')
  console.log('💫 Resetting execution context');
  await resetContext(docID, lang);
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
  const lang = notebookMetadata.get('language')

  console.log('🥁 Running All Code');
  await handleResetContext(docID, notebookMetadata, codeCells);

  const dreddCells = codeCells.map(cell => {
    const cellId = cell.get('id');
    const code = cell.get('content').toString();
    return { cellId, code };
  });

  const token = await sendManyToDredd(docID, dreddCells, lang);
  const response = await checkDreddStatus(token, lang);
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
