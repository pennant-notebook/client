import { MarkdownEditorProps } from '@/EditorTypes';
import { defaultBlockSchema } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import { getRandomColor } from '~/utils/awarenessHelpers';
import { Image, insertImage } from './Image';
import styles from './MarkdownCell.module.css';

const MarkdownEditor = ({ content, provider, currentUser, theme }: MarkdownEditorProps) => {
  // Temporarily override console.log
  const consoleLog = console.log;
  console.log = () => {};
  // ********************************

  const customSchema = {
    ...defaultBlockSchema,
    image: Image
  };

  const slashMenuItems = [insertImage];

  const editor = useBlockNote({
    blockSchema: customSchema,
    slashMenuItems,
    domAttributes: {
      editor: {
        class: [styles['blocknote-editor'], theme].join(' ')
      }
    },
    collaboration: {
      provider,
      fragment: content,
      user: {
        name: currentUser?.name || 'Anonymous User',
        color: currentUser?.color || getRandomColor()
      }
    }

    // onEditorReady: () => {
    //   const paragraph = document.querySelector(`#blockcell-${id} div div p`);
    //   if (paragraph?.textContent && paragraph.textContent.trim() === '') {
    //     paragraph.textContent = '';
    //   }
    // }
  });

  // Restore console.log
  setTimeout(() => (console.log = consoleLog), 0);

  return <BlockNoteView editor={editor} theme={theme} />;
};

export default MarkdownEditor;
