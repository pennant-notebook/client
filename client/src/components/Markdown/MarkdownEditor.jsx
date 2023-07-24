import { BlockNoteView, useBlockNote, ReactSlashMenuItem, defaultReactSlashMenuItems } from '@blocknote/react';
import { defaultBlockSchema } from '@blocknote/core';
import ImageIcon from '@mui/icons-material/Image';
import { ImageBlock } from './CustomBlockTypes';

const MarkdownEditor = ({ cell, content, provider, currentUser, theme }) => {
  const id = cell.get('id');

  const insertImage = new ReactSlashMenuItem(
    'Insert Image',
    editor => {
      const src = prompt('Enter image URL');
      editor.insertBlocks(
        [
          {
            type: 'image',
            props: {
              src: src || ''
            }
          }
        ],
        editor.getTextCursorPosition().block,
        'after'
      );
    },
    ['image', 'img', 'picture', 'media'],
    'Media',
    <ImageIcon />,
    'Insert an image'
  );

  const editor = useBlockNote({
    theme: theme,
    blockSchema: {
      ...defaultBlockSchema,
      image: ImageBlock
    },
    slashCommands: [...defaultReactSlashMenuItems, insertImage],
    collaboration: {
      provider,
      fragment: content,
      user: {
        name: currentUser ? currentUser.name : 'Default',
        color: currentUser ? currentUser.color : '#ff0000'
      }
    },
    editorDOMAttributes: {
      class: 'blocknote-editor'
    },
    onEditorReady: editor => {
      const paragraph = document.querySelector(`#blockcell-${id} div div p`);
      if (paragraph && paragraph.textContent === ' ') {
        paragraph.textContent = '';
      }
    }
  });

  return <BlockNoteView id={id} editor={editor} />;
};

export default MarkdownEditor;
