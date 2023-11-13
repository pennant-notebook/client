import { MarkdownEditorProps } from '@/EditorTypes';
import { defaultBlockSchema } from '@blocknote/core';
import { BlockNoteView, ReactSlashMenuItem, getDefaultReactSlashMenuItems, useBlockNote } from '@blocknote/react';
import { getAnalogColor, getRandomColor } from '~/utils/awarenessHelpers';
import styles from './MarkdownCell.module.css';
import { insertAlert } from './alert/Alert';
import { createAlertBlock } from './alert/helpers';

const MarkdownEditor = ({ content, provider, currentUser, theme }: MarkdownEditorProps) => {
  const customSchema = {
    ...defaultBlockSchema,
    alert: createAlertBlock('light')
  };

  const imageSlash = getDefaultReactSlashMenuItems().find(item => item.name === 'Image') as ReactSlashMenuItem;
  const slashMenuItems = [imageSlash, insertAlert];

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
        name: currentUser?.user?.name || 'Anonymous User',
        color: getAnalogColor(currentUser?.user?.color || getRandomColor())
      }
    },
    onEditorReady(editor) {
      const paragraphElements = document.querySelectorAll(
        '._blockContent_7sok8_22[data-content-type="paragraph"] p._inlineContent_7sok8_240'
      );
      paragraphElements.forEach(paragraphElement => {
        if (paragraphElement.textContent === ' ') {
          paragraphElement.textContent = '';
        }
      });
    }
  });

  return <BlockNoteView editor={editor} theme={theme} />;
};

export default MarkdownEditor;
