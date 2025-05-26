import { DreddCell, DreddResponse, DreddStatusResponse, DreddSubmitResponse } from "@/DreddTypes";
import { YMap } from "@/YjsTypes";
import axios, { AxiosError, AxiosResponse } from "axios";

const isDevelopment = import.meta.env.DEV;
const BASE_URL = isDevelopment 
  ? (import.meta.env.VITE_ENGINE_SERVER_DEV as string)
  : (import.meta.env.VITE_ENGINE_SERVER as string);
const PYTHON_URL = isDevelopment 
  ? (import.meta.env.VITE_FLASK_SERVER_DEV as string)
  : (import.meta.env.VITE_FLASK_SERVER as string);

interface Cell {
  cellId: string;
  code: string;
}

export const sendToDredd = async (
  language: string,
  notebookId: string,
  cellId: string,
  code: string
): Promise<string> => {
  const URL = language === "python" ? `${PYTHON_URL}/api/submit` : `${BASE_URL}/api/submit`;

  try {
    const result: AxiosResponse<DreddSubmitResponse> = await axios.post(URL, {
      notebookId,
      cells: [
        {
          cellId,
          code,
        },
      ],
    });
    return result.data.submissionId;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred");
  }
};

export const sendManyToDredd = async (
  notebookId: string,
  cells: Cell[],
  lang: string
): Promise<string> => {
  const URL = lang === "python" ? `${PYTHON_URL}/api/submit` : `${BASE_URL}/api/submit`;
  try {
    const result: AxiosResponse<DreddSubmitResponse> = await axios.post(URL, {
      notebookId,
      cells,
    });
    return result.data.submissionId;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred");
  }
};

export const checkDreddStatus = async (token: string, lang: string): Promise<DreddResponse[]> => {
  const URL = lang === "python" ? PYTHON_URL : BASE_URL;

  try {
    const response: AxiosResponse<DreddStatusResponse> = await axios.get(
      `${URL}/api/status/${token}`
    );
    const statusId = response.data.status;
    if (statusId === "critical error") {
      throw new Error("critical error");
    }

    if (statusId === "pending") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return checkDreddStatus(token, lang);
    } else {
      return response.data.results;
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 500) {
        console.log("server error");
      } else if (error.response?.status === 400) {
        console.log("bad request");
      }
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred");
  }
};

export const resetContext = async (notebookId: string, lang: string) => {
  const URL = lang === "python" ? PYTHON_URL : BASE_URL;
  try {
    return await axios.post(`${URL}/api/reset/${notebookId}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred");
  }
};

export const formatCellsForDredd = (codeCells: YMap[]): DreddCell[] => {
  return codeCells.map((c) => ({
    id: c.get("id") as string,
    code: c.get("content")?.toString() || "",
  }));
};

export const updateMetadata = (cellMetadata: YMap, notebookMetadata: YMap): void => {
  const numNotebookExecutions = notebookMetadata.get("executionCount") as number;
  cellMetadata.set("exeCount", numNotebookExecutions + 1);
  notebookMetadata.set("executionCount", numNotebookExecutions + 1);
};

export const handleDredd = async (
  language: string,
  docID: string,
  cellId: string,
  editorContent: string
): Promise<DreddResponse> => {
  const token = await sendToDredd(language, docID, cellId, editorContent);
  const response = await checkDreddStatus(token, language);
  return response[0];
};

export const handleResetContext = async (
  docID: string,
  notebookMetadata: YMap,
  codeCells: YMap[]
): Promise<void> => {
  const lang = notebookMetadata.get("language") as string;
  console.log("💫 Resetting execution context");
  await resetContext(docID, lang);
  notebookMetadata.set("executionCount", 0);
  codeCells.forEach((cell) => {
    const outputMap = cell.get("outputMap") as unknown as YMap;
    outputMap.set("stdout", "");
    outputMap.set("status", "");
    const metadata = cell.get("metaData") as unknown as YMap;
    metadata.set("exeCount", 0);
  });
};

export const handleRunAllCode = async (
  docID: string,
  codeCells: YMap[],
  notebookMetadata: YMap
): Promise<void> => {
  const lang = notebookMetadata.get("language") as string;

  console.log("🥁 Running All Code");
  await handleResetContext(docID, notebookMetadata, codeCells);

  const dreddCells = codeCells.map((cell) => {
    const cellId = cell.get("id") as string;
    const code = cell.get("content")?.toString() || "";
    return { cellId, code };
  });

  const token = await sendManyToDredd(docID, dreddCells, lang);
  const response = await checkDreddStatus(token, lang);
  for (const returnedCell of response) {
    const cell = codeCells.find((c) => c.get("id") === returnedCell.cellId);
    if (cell) {
      const outputMap = cell.get("outputMap") as unknown as YMap;
      if (returnedCell.output) {
        outputMap.set("stdout", returnedCell.output);
      }
      outputMap.set("status", returnedCell.type);
      updateMetadata(cell.get("metaData") as unknown as YMap, notebookMetadata);
    }
  }
};
