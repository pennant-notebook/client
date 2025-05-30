import { AwarenessUserState, UserState } from "@/ClientTypes";
import { NotebookContextType, NotebookType } from "@/NotebookTypes";
import { ProviderContextType } from "@/ProviderTypes";
import { YMap } from "@/YjsTypes";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSetRecoilState } from "recoil";
import { authState, notebookLanguageState } from "~/appState";
import { useNavbarContext } from "~/contexts/NavbarContext";
import { NotebookContext } from "~/contexts/NotebookContext";
import useProviderContext from "~/contexts/ProviderContext";
import { Box, useTheme } from "~/utils/MuiImports";
import {
  createClientAndStoreInLocalStorage,
  getClientFromLocalStorage,
  updateDisconnectedClient,
} from "~/utils/awarenessHelpers";
import { createCell, getUserObjects } from "~/utils/notebookHelpers";
import Cells from "../Cells/Cells";

interface NotebookProps {
  resourceTitle?: string;
  notebook: NotebookType;
}

const Notebook = ({ resourceTitle, notebook }: NotebookProps) => {
  const { doc, provider, awareness, notebookMetadata }: ProviderContextType = useProviderContext()!;
  const { setCodeCells, setClients } = useNavbarContext();
  const setNotebookLanguage = useSetRecoilState(notebookLanguageState);
  const theme = useTheme();
  const cellsArray = doc.getArray("cells");
  const [cellDataArr, setCellDataArr] = useState<YMap[]>(() => cellsArray.toArray() as YMap[]);
  const [allRunning, setAllRunning] = useState(false);
  document.title = resourceTitle || "Untitled Notebook";
  const setAuth = useSetRecoilState(authState);

  useEffect(() => {
    notebookMetadata.set("language", notebook.language);
    setNotebookLanguage(notebook.language || null);
  }, [notebook.language, notebookMetadata, setNotebookLanguage]);

  useEffect(() => {
    const cells = doc.getArray("cells");

    const observer = () => {
      setCellDataArr(cells.toArray() as YMap[]);
    };

    cells.observe(observer);

    return () => {
      cells.unobserve(observer);
    };
  }, [doc]);

  useEffect(() => {
    if (!awareness) return;

    const updateLocalUserInfo = () => {
      const userData = getClientFromLocalStorage();
      if (userData) {
        awareness.setLocalStateField("user", userData);
      } else {
        const { name, color } = createClientAndStoreInLocalStorage();
        awareness.setLocalStateField("user", { name, color });
      }
    };

    updateLocalUserInfo();

    const updateClients = () => {
      const states = awareness.getStates() as Map<number, AwarenessUserState>;
      const clientObjects = getUserObjects(states);
      setTimeout(() => setClients(clientObjects), 0);
    };

    awareness.on("update", updateClients);

    return () => {
      awareness.off("update", updateClients);
    };
  }, [awareness, setClients]);

  useEffect(() => {
    const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
      if (provider) {
        updateDisconnectedClient(provider);
      }
      // e.preventDefault();
      // e.returnValue = '';
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [provider]);

  useEffect(() => {
    const states = awareness.getStates() as Map<number, AwarenessUserState>;
    const clientObjects = getUserObjects(states);
    if (clientObjects.length > 0) {
      setAuth((prevAuth) => {
        if (!prevAuth.userData) return prevAuth;
        const updatedUserData: UserState = {
          ...prevAuth.userData,
          name: clientObjects[0].user.name,
          color: clientObjects[0].user.color,
        };
        localStorage.setItem("pennantAuthData", JSON.stringify(updatedUserData));
        const updatedAuthData = {
          ...prevAuth,
          userData: updatedUserData,
        };
        return updatedAuthData;
      });
    }
  }, [awareness, setAuth]);

  const deleteCell = async (id: string) => {
    const cellIndex = (cellsArray.toArray() as YMap[]).findIndex(
      (c) => (c.get("id") as string) === id
    );
    if (cellIndex !== -1) cellsArray.delete(cellIndex);
    updatePositions();
  };

  const addCellAtIndex = async (idx: number, type: string) => {
    const lang = notebookMetadata.get("language") || notebook.language;
    const cell = createCell(type, lang);
    cell.set("theme", theme.palette.mode);
    if (idx >= cellsArray.length) {
      cellsArray.push([cell as any]);
    } else {
      cellsArray.insert(idx + 1, [cell as any]);
    }
    updatePositions();
  };

  const updatePositions = () => {
    (cellsArray.toArray() as YMap[]).forEach((c, i) => c.set("pos", i));
  };

  const repositionCell = async (cell: YMap, newIndex: number) => {
    const clone = cell.clone();
    cell.set("id", "delete");
    await deleteCell("delete");
    cellsArray.insert(newIndex, [clone]);
    updatePositions();
  };

  useEffect(() => {
    const codeCellsForDredd = cellDataArr.filter((c) => (c.get("type") as string) === "code");
    setCodeCells(codeCellsForDredd);
  }, [cellDataArr, setCodeCells]);

  const contextValue: NotebookContextType = {
    addCellAtIndex,
    repositionCell,
    deleteCell,
    allRunning,
    setAllRunning,
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Box className="main-content">
        <DndProvider backend={HTML5Backend}>
          <Cells
            cells={cellDataArr}
            setCells={setCellDataArr}
          />
        </DndProvider>
      </Box>
    </NotebookContext.Provider>
  );
};

export default Notebook;
