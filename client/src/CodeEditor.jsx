import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import CompileButton from './components/CompileButton';
import LanguagesDropdown from './components/LanguagesDropdown';
import { languageOptions } from './constants/languageOptions';
import randomColor from 'randomcolor';
import Client from './components/Client';
import CopyRoomButton from './components/CopyRoomButton';
import OutputWindow from './components/OutputWindow';
import OutputDetails from './components/OutputDetails';
import { Box } from '@mui/material';

const CodeEditor = ({ roomID }) => {
  const editorRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [hideUsers, setHideUsers] = useState(false);
  const [currLang, setCurrLang] = useState(languageOptions[0]);
  const [compilerText, setCompilerText] = useState('');
  const [input, setInput] = useState('');
  const [outputType, setOutputType] = useState(null);
  const randomUserColor = randomColor();

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editorRef.current.getModel().setEOL(0);
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(roomID, ydoc, { signaling: [import.meta.env.VITE_BACKEND_URL] });
    const type = ydoc.getText('monaco');
    const outputMap = ydoc.getMap('output');

    setOutputType(outputMap);

    const undoManager = new Y.UndoManager(type);

    var person = prompt('Please enter your name, under 10 characters');

    if (!person || person.trim() === '' || person.trim() === '\u200B') {
      person = Math.floor(Math.random() * 10) + 'User';
    } else {
      person = person.trim().slice(0, 10);
    }

    const awareness = provider.awareness;

    awareness.setLocalStateField('user', {
      name: person,
      color: randomUserColor
    });

    const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), awareness);

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

    provider.connect();
  }

  useEffect(() => {
    if (outputType) {
      outputType.observe(() => {
        const data = outputType.get('data');
        setCompilerText(data);
      });
    }
  }, [outputType]);

  return (
    <Box sx={{ mx: 5, py: 1 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {hideUsers ? null : (
          <Box sx={{ display: 'flex', gap: 3 }}>
            {users.map(user => (
              <Client key={user.clientId} username={user.name} color={user.color} />
            ))}
          </Box>
        )}
      </Box>
      <LanguagesDropdown language={currLang} onSelectChange={event => setCurrLang(event)} />
      <Editor
        aria-labelledby='Code Editor'
        className='justify-center'
        language={currLang.id === 'python3' || currLang.id === 'python2' ? 'python' : currLang.id}
        height='50vh'
        theme='vs-dark'
        onMount={handleEditorDidMount}
        options={{
          cursorBlinking: 'smooth'
        }}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <CompileButton
          content={editorRef}
          language={currLang}
          input={input}
          setOutput={output => {
            setCompilerText(output);
          }}
          outputType={outputType}
        />
        <CopyRoomButton />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        {/* <InputWindow
          setInput={input => {
            setInput(input);
          }}
        /> */}
        <OutputWindow outputDetails={compilerText} />
      </Box>
      <OutputDetails outputDetails={compilerText} />
    </Box>
  );
};

export default CodeEditor;
