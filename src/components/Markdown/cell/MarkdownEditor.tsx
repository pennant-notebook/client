import { MarkdownEditorProps } from '@/EditorTypes';
import { defaultBlockSchema } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import { getRandomColor } from '~/utils/awarenessHelpers';
import { Image, insertImage } from './blocktypes/Image';
import styles from './MarkdownCell.module.css';
import { insertAlert } from './blocktypes/alert/Alert';
import { createAlertBlock } from './blocktypes/alert/helpers';

const MarkdownEditor = ({ content, provider, currentUser, theme }: MarkdownEditorProps) => {
  /* Temporarily override console.log */
  const consoleLog = console.log;
  console.log = () => {};
  /* -------------------------------- */

  const customSchema = {
    ...defaultBlockSchema,
    image: Image,
    alert: createAlertBlock('light')
  };

  const slashMenuItems = [insertAlert, insertImage];

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
  });

  /* Restore console.log */
  setTimeout(() => (console.log = consoleLog), 0);

  return <BlockNoteView editor={editor} theme={theme} />;
};

export default MarkdownEditor;
