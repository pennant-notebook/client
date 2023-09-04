import { MarkdownEditorProps } from '@/EditorTypes';
import { BlockSchema, defaultBlockSchema } from '@blocknote/core';
import { BlockNoteView, getDefaultReactSlashMenuItems, useBlockNote } from '@blocknote/react';
import React from 'react';
import { getRandomColor } from '~/utils/awarenessHelpers';
import { Image, insertImage } from './Image';
import styles from './MarkdownCell.module.css';

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ cell, content, provider, currentUser, theme }) => {
  // Temporarily override console.log
  const consoleLog = console.log;
  console.log = () => {};
  const id = cell.get('id');
  // ********************************

  const customSchema = {
    ...defaultBlockSchema,
    image: Image
  } satisfies BlockSchema;

  const editor = useBlockNote(
    {
      blockSchema: customSchema,
      slashMenuItems: [...getDefaultReactSlashMenuItems(), insertImage],
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
      },

      onEditorReady: () => {
        const paragraph = document.querySelector(`#blockcell-${id} div div p`);
        if (paragraph?.textContent && paragraph.textContent.trim() === '') {
          paragraph.textContent = '';
        }
      }
    },
    [theme]
  );

  // Restore console.log
  setTimeout(() => (console.log = consoleLog), 0);

  return <BlockNoteView editor={editor} theme={theme} />;
};

export default MarkdownEditor;
