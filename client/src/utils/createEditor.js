import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, basicSetup } from 'codemirror';
import { yCollab } from 'y-codemirror.next';
import { EditorState } from '@codemirror/state';
import { defaultKeymap } from '@codemirror/commands';
import { keymap } from '@codemirror/view';

const createEditorState = (content, awareness, id, handleRunCode) => {
  const customKeymap = keymap.of([
    { key: 'Alt-Enter', mac: 'Alt-Enter', run: handleRunCode, preventDefault: true },
    ...defaultKeymap
  ]);
  const state = EditorState.create({
    doc: content.toString(),
    extensions: [
      basicSetup,
      customKeymap,
      javascript(),
      yCollab(content, awareness),
      EditorView.lineWrapping,
      EditorView.theme({
        '.cm-content, .cm-gutter': {
          marginTop: '6px'
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
