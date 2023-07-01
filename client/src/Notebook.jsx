import { useEffect, useState, useRef } from 'react';
import { Box, Button, Toolbar } from '@mui/material';
import { AddCircleTwoTone, Code } from '@mui/icons-material';
import MarkdownCell from './MarkdownCell';
import * as Y from 'yjs';

import CodeCell from './CodeCell';
import { v4 as uuidv4 } from 'uuid';
import NotebookContext from './NotebookContext';
// import NotebookProvider, { useNotebookContext } from './NotebookContext';
import Client from './components/Client';
import AddCell from './AddCell';

import { createUser, updateUsers, initializeProvider, initializeYDoc } from './notebookHelpers';

const roomToProviderMap = new Map();
const roomToYDocMap = new Map();

const Notebook = ({ roomID }) => {
  const ydocRef = useRef(roomToYDocMap.get(roomID));
  const providerRef = useRef(roomToProviderMap.get(roomID));
  const [awareness, setAwareness] = useState(null);

  const [editing, setEditing] = useState(null);
  const textRef = useRef(null);
  const [hoverTop, setHoverTop] = useState(false);
  const [users, setUsers] = useState([]);
  const [hideUsers, setHideUsers] = useState(false);
  const [cells, setCells] = useState([]);
  const [cellsJSON, setCellsJSON] = useState([]);

  useEffect(() => {
    if (ydocRef.current) {
      const cells = ydocRef.current.getArray('cells');
      console.log(cells);
      setCells(cells);
      setCellsJSON(cells.toJSON());
    }
  }, [ydocRef.current]);

  useEffect(() => {
    if (!ydocRef.current) {
      ydocRef.current = initializeYDoc(roomID);
      roomToYDocMap.set(roomID, ydocRef.current);
    }

    if (!providerRef.current) {
      providerRef.current = initializeProvider(ydocRef.current, roomID);
      roomToProviderMap.set(roomID, providerRef.current);
      setAwareness(providerRef.current.awareness);
    }
  }, [roomID]);

  useEffect(() => {
    if (!awareness) return;
    const { name, color } = createUser();
    awareness.setLocalStateField('user', { name, color });

    awareness.on('update', () => {
      var jsonData = Array.from(awareness.getStates());
      if (jsonData.length > 1) {
        setHideUsers(false);
        setUsers(
          jsonData.map(item => ({
            clientId: item[0],
            name: item[1].user.name,
            color: item[1].user.color
          }))
        );
      } else {
        setHideUsers(true);
      }

      var jsonData = Array.from(awareness.getStates());
      updateUsers(jsonData);
    });

    providerRef.current.connect();

    return () => {
      providerRef.current.disconnect();
    };
  }, [awareness]);

  const deleteCell = id => {
    const cellArray = ydocRef.current.getArray('cells');
    const cellIndex = cellArray.toArray().findIndex(c => c.get('id') === id);
    console.log('cellIndex', cellIndex);
    if (cellIndex !== -1) {
      cellArray.delete(cellIndex);
      // below refreshes the notebook to immediately show the new state of the notebook without the deleted cell
      setCellsJSON(prevState => prevState.filter(cell => cell.id !== id));
    }
  };

  const addCellAtIndex = (idx, type) => {
    const cellArray = ydocRef.current.getArray('cells');
    const cell = new Y.Map();
    cell.set('id', uuidv4());
    cell.set('type', type);
    cell.set('text', new Y.Text('empty'));
    if (idx >= cellArray.length) {
      cellArray.push([cell]);
    } else {
      cellArray.insert(idx + 1, [cell]);
    }
    setCells(cellArray);
    setCellsJSON(cellArray.toJSON());
  };

  const handleEditingChange = (id, content) => {
    const cellArray = ydocRef.current.getArray('cells');
    const cell = cellArray.toArray().find(c => c.get('id') === id);
    if (cell) {
      const yText = cell.get('text');
      yText.delete(0, yText.toString().length);
      yText.insert(0, content);
    }
  };

  const handleDoubleClick = index => {
    setEditing(index);
    textRef.current?.focus();
  };

  const handleBlur = () => {
    setTimeout(() => {
      setEditing(null);
    }, 100);
  };

  const contextValue = {
    cells,
    addCellAtIndex,
    deleteCell,
    handleEditingChange,
    handleDoubleClick,
    handleBlur,
    editing,
    setEditing,
    awareness,
    ydoc: ydocRef.current,
    provider: providerRef.current
  };

  return (
    <NotebookContext.Provider value={contextValue}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {hideUsers ? null : (
          <Box sx={{ display: 'flex', gap: 3 }}>
            {users.map(user => (
              <Client key={user.clientId} username={user.name} color={user.color} />
            ))}
          </Box>
        )}
      </Box>
      {cells.length > 0 && <AddCell index={0} hover={hoverTop} setHover={setHoverTop} isFirst={true} />}
      <Box mt={2} sx={{ textAlign: 'center' }}>
        {cells.length === 0 && (
          <Toolbar sx={{ width: '30%', margin: '0 auto', justifyContent: 'space-between' }}>
            <Button onClick={() => addCellAtIndex(0, 'markdown')} variant='contained'>
              <AddCircleTwoTone /> Markdown
            </Button>
            <Button onClick={() => addCellAtIndex(0, 'code')} variant='contained'>
              <Code sx={{ mr: '5px' }} /> Code
            </Button>
          </Toolbar>
        )}
      </Box>
      <Box sx={{ mx: 5, py: 1 }}>
        {cells &&
          cells.map((cell, index) => {
            const id = cell.get('id');
            const type = cell.get('type');
            const text = cell.get('text');
            return (
              <Box key={id || index}>
                {type === 'markdown' && <MarkdownCell id={id} index={index} cell={cell} ytext={text} />}
                {type === 'code' && <CodeCell id={id} index={index} cell={cell} ytext={text} />}
              </Box>
            );
          })}
      </Box>
    </NotebookContext.Provider>
  );
};

export default Notebook;
