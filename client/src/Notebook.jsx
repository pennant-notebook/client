import { useEffect, useRef, useState } from 'react';
import { Box, Button, Toolbar } from '@mui/material';
import { AddCircleTwoTone, Code } from '@mui/icons-material';

import randomColor from 'randomcolor';
import { WebrtcProvider } from 'y-webrtc';
import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs';
import MarkdownCell from './MarkdownCell';
import CodeCell from './CodeCell';
import NotebookContext from './NotebookContext';
import { MonacoBinding } from 'y-monaco';
import { languageOptions } from './constants/languageOptions';
import Client from './components/Client';
import AddCell from './AddCell';

const roomToProviderMap = new Map();
const roomToYDocMap = new Map();

const Notebook = ({ roomID }) => {
  // Y.Doc, Provider and Awareness setup
  const ydocRef = useRef(roomToYDocMap.get(roomID));
  const providerRef = useRef(roomToProviderMap.get(roomID));
  const [awareness, setAwareness] = useState(null);

  const editorRef = useRef(null);
  const [compilerText, setCompilerText] = useState('');
  const [outputType, setOutputType] = useState(null);
  const [cells, setCells] = useState([]);
  const [hoverTop, setHoverTop] = useState(false);

  // Users setup / management
  const [users, setUsers] = useState([]);
  const [hideUsers, setHideUsers] = useState(false);

  const [editing, setEditing] = useState(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (ydocRef.current) {
      const cells = ydocRef.current.getMap('shared').get('cells');
      setCells(cells);
      // cells is Y.Array of YMaps
    }
  }, [ydocRef.current]);

  useEffect(() => {
    if (!ydocRef.current) {
      ydocRef.current = new Y.Doc();
      const cells = new Y.Array();
      ydocRef.current.getMap('shared').set('cells', cells);
      roomToYDocMap.set(roomID, ydocRef.current);
      setCells(cells);
    }

    if (!providerRef.current) {
      providerRef.current = new WebrtcProvider(roomID, ydocRef.current, {
        signaling: [import.meta.env.VITE_BACKEND_URL]
      });
      roomToProviderMap.set(roomID, providerRef.current);
      setAwareness(providerRef.current.awareness);
    }
    //asASD
  }, [roomID]);

  useEffect(() => {
    if (!awareness) return;
    console.log('should ask for username');
    const username = prompt('Please enter your name, under 10 characters');
    const color = randomColor();
    const name =
      !username || username.trim() === '' || username.trim() === '\u200B'
        ? `${Math.floor(Math.random() * 10)}User`
        : username.trim().slice(0, 10);

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

      var clientsArr = jsonData.map(item => ({
        clientId: item[0],
        name: item[1].user.name,
        color: item[1].user.color
      }));

      clientsArr.forEach(client => {
        const selectionClass = `yRemoteSelection-${client.clientId}`;
        const selectionHeadClass = `yRemoteSelectionHead-${client.clientId}`;

        const red = parseInt(client.color.substring(1, 3), 16);
        const green = parseInt(client.color.substring(3, 5), 16);
        const blue = parseInt(client.color.substring(5, 7), 16);

        const selectionStyle = document.createElement('style');
        selectionStyle.innerHTML = `
                    .${selectionClass} {
                        background-color: rgba(${red}, ${green}, ${blue}, 0.70);
                        border-radius: 2px
                    }

                    .${selectionHeadClass} {
                        z-index: 1;
                        position: absolute;
                        border-left: ${client.color} solid 2px;
                        border-top: ${client.color} solid 2px;
                        border-bottom: ${client.color} solid 2px;
                        height: 100%;
                        box-sizing: border-box;
                    }

                    .${selectionHeadClass}::after {
                        position: absolute;
                        content: ' ';
                        border: 3px solid ${client.color};
                        border-radius: 4px;
                        left: -4px;
                        top: -5px;
                    }

                    .${selectionHeadClass}:hover::before {
                        content: '${client.name}';
                        position: absolute;
                        background-color: ${client.color};
                        color: black;
                        padding-right: 3px;
                        padding-left: 3px;
                        margin-top: -2px;
                        font-size: 12px;
                        border-top-right-radius: 4px;
                        border-bottom-right-radius: 4px;
                    }
                `;
        document.head.appendChild(selectionStyle);
      });
    });

    providerRef.current.connect();

    return () => {
      providerRef.current.disconnect();
    };
  }, [awareness]);

  const handleEditingChange = (id, content) => {
    const cellArray = ydocRef.current.getArray('cells');
    const cell = cellArray.toArray().find(c => c.get('id') === id);
    if (cell) {
      const yText = cell.get('text');
      yText.delete(0, yText.toString().length);
      yText.insert(0, content);
    }
  };

  const deleteCell = id => {
    const cellArray = ydocRef.current.getArray('cells');
    const cellIndex = cellArray.toArray().findIndex(c => c.get('id') === id);
    if (cellIndex !== -1) {
      cellArray.delete(cellIndex);
    }
  };

  const addCellAtIndex = (idx, type) => {
    const cellArray = ydocRef.current.getMap('shared').get('cells');
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

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editorRef.current.getModel().setEOL(0);
  }

  useEffect(() => {
    if (awareness && editorRef.current) {
      const type = ydocRef.current.getText('monaco');
      const undoManager = new Y.UndoManager(type);
      const outputMap = ydocRef.current.getMap('output');
      setOutputType(outputMap);
      const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), awareness);
    }
  }, [awareness, editorRef.current]);

  useEffect(() => {
    if (outputType) {
      outputType.observe(() => {
        const data = outputType.get('data');
        setCompilerText(data);
      });
    }
  }, [outputType]);

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
      {cells.length > 0 && (
        <AddCell addCell={addCellAtIndex} index={0} hover={hoverTop} setHover={setHoverTop} isFirst={true} />
      )}
      <Box mt={2} sx={{ textAlign: 'center' }}>
        {cells.length == 0 && (
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
