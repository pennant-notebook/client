import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, basicSetup } from 'codemirror';
import { yCollab } from 'y-codemirror.next';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, indentMore, indentLess, indentSelection } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { autocompletion } from '@codemirror/autocomplete';

const betterTab = ({ state, dispatch }) => {
  let headPos = state.selection.main.head;
  let lineContent = state.doc.lineAt(headPos).text;

  if (lineContent.trim() === '') {
    dispatch({
      changes: { from: headPos, insert: '  ' },
      selection: { anchor: headPos + 2 },
      scrollIntoView: true
    });
    return true;
  } else if (state.selection.ranges.some(r => !r.empty)) {
    return indentMore(state, dispatch);
  } else {
    dispatch({
      changes: { from: state.selection.main.from, insert: '  ' },
      selection: { anchor: state.selection.main.from + 2 },
      scrollIntoView: true
    });
    return true;
  }
};

const createEditorState = (content, awareness, id, handleRunCode) => {
  const customKeymap = keymap.of([
    { key: 'Alt-Enter', mac: 'Alt-Enter', run: handleRunCode, preventDefault: true },
    { key: 'Tab', run: betterTab },
    { key: 'Shift-Tab', run: indentLess },
    ...defaultKeymap
  ]);

  const state = EditorState.create({
    doc: content.toString(),
    extensions: [
      basicSetup,
      customKeymap,
      javascript(),
      autocompletion(),
      yCollab(content, awareness),
      EditorView.lineWrapping,
      EditorView.theme({
        '.cm-content, .cm-gutter': {
          marginTop: '8px',
          marginBottom: '8px',
          fontSize: '15px'
        }
      }),
      oneDark
    ]
  });

  return new EditorView({
    state,
    parent: document.querySelector('#editor-' + id)
  });
};

export default createEditorState;
