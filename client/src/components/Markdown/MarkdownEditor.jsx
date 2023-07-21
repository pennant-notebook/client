import {
  BlockNoteView,
  useBlockNote,
  InlineContent,
  ReactSlashMenuItem,
  defaultReactSlashMenuItems,
  createReactBlockSpec
} from '@blocknote/react';
import { defaultBlockSchema, defaultProps } from '@blocknote/core';
import ImageIcon from '@mui/icons-material/Image';

const MarkdownEditor = ({ cell, content, provider, currentUser, theme }) => {
  const id = cell.get('id');
  const ImageBlock = createReactBlockSpec({
    type: 'image',
    propSchema: defaultProps,
    containsInlineContent: true,
    render: ({ block }) => (
      <div id='image-wrapper'>
        {block.props.src && (
          <img
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
            src={block.props.src}
            alt={'Image'}
            contentEditable={false}
          />
        )}
        <InlineContent />
      </div>
    )
  });

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
      style: 'padding: 8px 24px; border-radius: 0px;'
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
