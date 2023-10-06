import { NotebookContextType, NotebookType } from '@/NotebookTypes';
import { ProviderContextType } from '@/ProviderTypes';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { NotebookContext } from '~/contexts/NotebookContext';
import useProviderContext from '~/contexts/ProviderContext';
import { Box, useTheme } from '~/utils/MuiImports';
import { getClientFromLocalStorage, updateDisconnectedClient } from '~/utils/awarenessHelpers';
import { YMap, createCell, getUserObjects } from '~/utils/notebookHelpers';
import Cells from '../Cells/Cells';
import { useNavbarContext } from '~/contexts/NavbarContext';
import { useSetRecoilState } from 'recoil';
import { notebookLanguageState } from '~/appState';

interface NotebookProps {
  docID: string;
  resourceTitle?: string;
  notebook: NotebookType;
}

const Notebook = ({ docID, resourceTitle, notebook }: NotebookProps) => {
  const { doc, provider, awareness, notebookMetadata }: ProviderContextType = useProviderContext()!;
  const { setCodeCells, setClients } = useNavbarContext();
  const setNotebookLanguage = useSetRecoilState(notebookLanguageState);
  const theme = useTheme();
  const cellsArray = doc.getArray('cells');
  const [cellDataArr, setCellDataArr] = useState(cellsArray.toArray());
  const [allRunning, setAllRunning] = useState(false);
  document.title = resourceTitle || 'Untitled Notebook';

  useEffect(() => {
    console.log(notebook.language);
    notebookMetadata.set('language', notebook.language);
    setNotebookLanguage(notebook.language || null);
  }, []);

  useEffect(() => {
    const cells = doc.getArray('cells');

    const observer = () => {
      setCellDataArr(cells.toArray());
    };

    cells.observe(observer);
  }, [docID]);

  useEffect(() => {
    if (!awareness) return;

    const { name, color } = getClientFromLocalStorage();

    awareness.setLocalStateField('user', { name, color });

    const updateClients = () => {
      const states: Map<number, any> = new Map(Array.from(awareness.getStates()));
      const clientObjects = getUserObjects(states);
      setTimeout(() => setClients(clientObjects), 0);
    };

    awareness.on('update', updateClients);

    return () => {
      awareness.off('update', updateClients);
    };
  }, [awareness]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (provider) {
        updateDisconnectedClient(provider);
      }
      // e.preventDefault();
      // e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [provider]);

  const deleteCell = async (id: string) => {
    const cellIndex = cellsArray.toArray().findIndex((c: YMap) => c.get('id') === id);
    if (cellIndex !== -1) cellsArray.delete(cellIndex);
    updatePositions();
  };

  const addCellAtIndex = async (idx: number, type: string) => {
    const lang = notebookMetadata.get('language') || notebook.language;
    const cell = createCell(type, lang);
    cell.set('theme', theme.palette.mode);
    if (idx >= cellsArray.length) {
      cellsArray.push([cell]);
    } else {
      cellsArray.insert(idx + 1, [cell]);
    }
    updatePositions();
  };

  const updatePositions = () => {
    cellsArray.toArray().forEach((c: YMap, i: number) => c.set('pos', i));
  };

  const repositionCell = async (cell: YMap, newIndex: number) => {
    const clone = cell.clone();
    cell.set('id', 'delete');
    await deleteCell('delete');
    cellsArray.insert(newIndex, [clone]);
    updatePositions();
  };

  useEffect(() => {
    const codeCellsForDredd = cellDataArr.filter((c: YMap) => c.get('type') === 'code');
    setCodeCells(codeCellsForDredd);
  }, [cellDataArr]);

  const contextValue: NotebookContextType = {
    addCellAtIndex,
    repositionCell,
    deleteCell,
    allRunning,
    setAllRunning
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Box className='main-content'>
        <DndProvider backend={HTML5Backend}>
          <Cells cells={cellDataArr} setCells={setCellDataArr} />
        </DndProvider>
      </Box>
    </NotebookContext.Provider>
  );
};

export default Notebook;
