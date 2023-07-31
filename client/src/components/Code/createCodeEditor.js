import { javascript } from '@codemirror/lang-javascript';
import { EditorView, basicSetup } from 'codemirror';
import { yCollab } from 'y-codemirror.next';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, indentMore, indentLess } from '@codemirror/commands';
import { keymap, lineNumbers } from '@codemirror/view';
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

const createCodeEditor = (content, id, awareness, handleRunCode, editorTheme) => {
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
          overflow: 'visible !important'
        },
        '.cm-content, .cm-gutter': {
          marginTop: '8px',
          marginBottom: '8px',
          fontSize: '15px'
        },
        '.cm-tooltip': {
          zIndex: 1000
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

// export const updateLineNumbers = (view, startingLineNumber) => {
//   const transaction = view.state.update({
//     reconfigure: {
//       [lineNumbers()]: lineNumbers({
//         formatNumber: lineNo => lineNo + startingLineNumber - 1
//       })
//     }
//   });
//   view.dispatch(transaction);
// };

export default createCodeEditor;
