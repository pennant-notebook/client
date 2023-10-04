import { MarkdownEditorProps } from '@/EditorTypes';
import { defaultBlockSchema } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import { getRandomColor } from '~/utils/awarenessHelpers';
import { Image, insertImage } from './blocktypes/Image';
import styles from './MarkdownCell.module.css';
import { insertAlert } from './blocktypes/alert/Alert';
import { createAlertBlock } from './blocktypes/alert/helpers';

const MarkdownEditor = ({ content, provider, currentUser, theme }: MarkdownEditorProps) => {
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
