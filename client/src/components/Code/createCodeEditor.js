import { javascript } from '@codemirror/lang-javascript';
import { EditorView, basicSetup } from 'codemirror';
import { yCollab } from 'y-codemirror.next';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, indentMore, indentLess } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { autocompletion, acceptCompletion } from '@codemirror/autocomplete';
import beautify from 'js-beautify';

function formatCode(view) {
  const code = view.state.doc.toString();
  const formattedCode = beautify.js(code, {
    indent_size: 2,
    indent_with_tabs: false,
    end_with_newline: true,
    quote_style: 1
  });
  const transaction = view.state.update({
    changes: { from: 0, to: view.state.doc.length, insert: formattedCode }
  });
  view.dispatch(transaction);
}

const createCodeEditor = (content, id, awareness, handleRunCode, editorTheme, hasOutput) => {
  const customKeymap = keymap.of([
    { key: 'Alt-Enter', mac: 'Alt-Enter', run: handleRunCode, preventDefault: true },
    {
      key: 'Alt-Shift-f',
      run: view => {
        formatCode(view);
        return true;
      },
      preventDefault: true
    },
    { key: 'Tab', run: acceptCompletion },
    { key: 'Tab', run: indentMore },
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
        '&, .cm-scroller, .cm-content, .cm-gutter': {
          overflow: 'visible !important',
          borderBottomRightRadius: hasOutput ? '0px' : '5px',
          borderBottomLeftRadius: hasOutput ? '0px' : '5px'
        },
        '.cm-content, .cm-gutter': {
          marginTop: '8px',
          marginBottom: '8px',
          fontSize: '15px'
        },
        '.cm-tooltip, .cm-tooltip-autocomplete, .cm-tooltip-below': {
          zIndex: '9999 !important'
        },
        '.cm-scroller': {
          minHeight: '50px'
        }
      }),
      editorTheme.theme
    ]
  });

  let view = new EditorView({
    state,
    parent: document.querySelector('#editor-' + id)
  });

  return view;
};

export default createCodeEditor;
