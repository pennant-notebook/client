import { BlockNoteView, useBlockNote } from '@blocknote/react';
import { defaultBlockSchema, BlockSchema } from '@blocknote/core';
import styles from './MarkdownCell.module.css';
import React from 'react';
import { MarkdownEditorProps } from '~/utils/notebookHelpers';
import { getDefaultReactSlashMenuItems } from '@blocknote/react';
import { Image, insertImage } from './Image';
import { getRandomColor } from '~/utils/awarenessHelpers';

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
