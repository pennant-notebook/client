import { BlockNoteView, useBlockNote } from '@blocknote/react';

const MarkdownEditor = ({ cell, content, provider, currentUser, theme }) => {
  const id = cell.get('id');

  const editor = useBlockNote({
    theme: theme,
    collaboration: {
      provider,
      fragment: content,
      user: {
        name: currentUser ? currentUser.name : 'Default',
        color: currentUser ? currentUser.color : '#ff0000'
      }
    },
    editorDOMAttributes: {
      style: 'padding: 8px 24px; border-radius: 0px'
    },
    onEditorReady: editor => {
      // console.log('editor ready');
      const paragraph = document.querySelector(`#blockcell-${id} div div p`);
      if (paragraph && paragraph.textContent === ' ') {
        paragraph.textContent = '';
      }
    }
  });

  return <BlockNoteView id={id} editor={editor} />;
};

export default MarkdownEditor;
