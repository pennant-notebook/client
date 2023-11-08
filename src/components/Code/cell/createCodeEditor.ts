import { CreateCodeEditorProps } from '@/EditorTypes';
import { acceptCompletion, autocompletion } from '@codemirror/autocomplete';
import { defaultKeymap, indentLess, indentMore } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { EditorView, basicSetup } from 'codemirror';
import beautify from 'js-beautify';
import { yCollab } from 'y-codemirror.next';
import { python } from '@codemirror/lang-python';


function formatCode(view: EditorView) {
  const code = view.state.doc.toString();
  const formattedCode = beautify.js(code, {
    indent_size: 2,
    indent_with_tabs: false,
    end_with_newline: true,
    // quote_style: 1
  });
  const transaction = view.state.update({
    changes: { from: 0, to: view.state.doc.length, insert: formattedCode }
  });
  view.dispatch(transaction);
}

export const themeClass = (notebookTheme: string, hasOutput: boolean) => {
  const themeClassName = notebookTheme === 'dark' ? 'cm-theme-dark' : 'cm-theme-light';
  const outputClassName = hasOutput ? 'cm-hasOutput' : 'cm-hasNoOutput';
  return EditorView.editorAttributes.of({
    class: `${themeClassName} ${outputClassName}`
  });
};

const createCodeEditor = (props: CreateCodeEditorProps) => {
  const { content, id, awareness, handleRunCode, editorTheme, hasOutput, language, notebookTheme } = props;

  const customKeymap = keymap.of([
    {
      key: 'Alt-Enter', mac: 'Alt-Enter', run: () => {
        handleRunCode();
        return true;
      }, preventDefault: true
    },
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
      language === 'javascript' ? javascript() : python(),
      autocompletion(),
      yCollab(content, awareness),
      EditorView.lineWrapping,
      themeClass(notebookTheme, hasOutput),
      EditorView.theme({
        '.cm-gutters, .cm-gutter, .cm-scroller': {
          backgroundColor: notebookTheme === 'dark' ? '#121212' : 'inherit'
        },
        '&, .cm-scroller, .cm-content, .cm-gutters': {
          overflow: 'visible !important',
          borderBottomRightRadius: hasOutput ? '0px' : '5px',
          borderBottomLeftRadius: hasOutput ? '0px' : '5px',
        },
        '.cm-content, .cm-gutter': {
          marginTop: '8px',
          marginBottom: '8px',
          fontSize: '15px',
        },
        '.cm-tooltip, .cm-tooltip-autocomplete, .cm-tooltip-below': {
          zIndex: '9999 !important',
        },
        '.cm-scroller': {
          minHeight: '50px'
        },
        '.cm-ySelectionCaretDot': {
          opacity: '0'
        },
        '.cm-ySelectionInfo': {
          fontSize: '11.8px',
          fontFamily:
            'Inter,SF Pro Display,-apple-system,BlinkMacSystemFont,Open Sans,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
          fontWeight: 600,
          color: '#fff',
          padding: '0.5px 2.5px',
          borderRadius: '3px 3px 3px 0',
          WebkitFontSmoothing: 'antialiased',
          fontVariantLigatures: 'none',
          fontFeatureSettings: '"liga" 0',
          opacity: '1 !important',
          transitionDelay: '0s !important'
        },
        '.cm-focused': {
          outline: 'none !important;'
        }
      }),
      editorTheme.theme
    ]
  });

  let view = new EditorView({
    state,
    parent: document.querySelector('#editor-' + id)!
  });

  return view;
};

export default createCodeEditor;
