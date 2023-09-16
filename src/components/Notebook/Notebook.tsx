import { ClientType } from '@/ClientTypes';
import { NotebookContextType } from '@/NotebookTypes';
import { ProviderContextType } from '@/ProviderTypes';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router';
import { NotebookContext } from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { Box, useTheme } from '../../utils/MuiImports';
import { getClientFromLocalStorage, updateDisconnectedClient } from '../../utils/awarenessHelpers';
import { YMap, createCell, getUserObjects } from '../../utils/notebookHelpers';
import Cells from '../Cells/Cells';
import Navbar from './Navbar';

interface NotebookProps {
  docID: string;
  resourceTitle?: string;
}

const Notebook = ({ docID, resourceTitle }: NotebookProps) => {
  const { doc, provider, awareness, notebookMetadata }: ProviderContextType = useProviderContext()!;
  const navigate = useNavigate();
  const theme = useTheme();

  const cellsArray = doc.getArray('cells');
  const [cellDataArr, setCellDataArr] = useState(cellsArray.toArray());
  const [allRunning, setAllRunning] = useState(false);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [title, setTitle] = useState<string>(resourceTitle || docID);
  document.title = resourceTitle || 'Untitled Notebook';

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
    const cell = createCell(type);
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

  const handleTitleChange = (newTitle: string) => {
    notebookMetadata.set('title', newTitle);
    setTitle(newTitle);
  };

  useEffect(() => {
    const titleObserver = () => {
      const docTitle = notebookMetadata.get('title');
      const displayTitle = docTitle ? docTitle.toString() : 'Untitled';
      setTitle(displayTitle);
      document.title = displayTitle;
    };

    if (notebookMetadata) {
      notebookMetadata.observe(titleObserver);
    }

    return () => {
      notebookMetadata.unobserve(titleObserver);
    };
  }, [title]);

  const handleDisconnect = (destination: string) => {
    if (docID) {
      const currentClients = updateDisconnectedClient(provider);
      setClients(currentClients || []);
    }
    navigate(destination);
  };

  const codeCellsForDredd = cellDataArr.filter((c: YMap) => c.get('type') === 'code');

  const contextValue: NotebookContextType = {
    addCellAtIndex,
    repositionCell,
    deleteCell,
    title,
    handleTitleChange,
    allRunning,
    setAllRunning
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Box className='main-content'>
        <Navbar codeCells={codeCellsForDredd} clients={clients} handleDisconnect={handleDisconnect} />
        <DndProvider backend={HTML5Backend}>
          <Cells cells={cellDataArr} setCells={setCellDataArr} />
        </DndProvider>
      </Box>
    </NotebookContext.Provider>
  );
};

export default Notebook;
