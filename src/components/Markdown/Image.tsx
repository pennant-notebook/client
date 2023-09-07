import { BlockNoteEditor, BlockSchema, BlockSpec, PropSchema, SpecificBlock, defaultProps } from '@blocknote/core';
import ImageIcon from '@mui/icons-material/Image';

import { CSSProperties, useEffect, useMemo, useState } from 'react';

import { InlineContent, ReactSlashMenuItem, createReactBlockSpec } from '@blocknote/react';

// Converts text alignment prop values to the flexbox `align-items` values.
const textAlignmentToAlignItems = (
  textAlignment: 'left' | 'center' | 'right' | 'justify'
): 'flex-start' | 'center' | 'flex-end' => {
  switch (textAlignment) {
    case 'left':
      return 'flex-start';
    case 'center':
      return 'center';
    case 'right':
      return 'flex-end';
    default:
      return 'flex-start';
  }
};

// Max & min image widths as a fraction of the editor's width
const maxWidth = 1.0;
const minWidth = 0.1;

const imagePropSchema = {
  textAlignment: defaultProps.textAlignment,
  backgroundColor: defaultProps.backgroundColor,
  src: {
    default: 'https://via.placeholder.com/150' as const
  },
  // Image width as a fraction of the editor's width
  width: {
    default: '0.5' as const
  },
  // Whether to show the image upload dashboard or not
  replacing: {
    default: 'false' as const,
    values: ['true', 'false'] as const
  }
} satisfies PropSchema;

const ImageComponent = (props: {
  block: SpecificBlock<
    BlockSchema & {
      image: BlockSpec<'image', typeof imagePropSchema>;
    },
    'image'
  >;
  editor: BlockNoteEditor<
    BlockSchema & {
      image: BlockSpec<'image', typeof imagePropSchema>;
    }
  >;
}) => {
  const [hovered, setHovered] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<'left' | 'right' | null>(null);

  const [initialWidth, setInitialWidth] = useState(0);
  const [initialClientX, setInitialClientX] = useState(0);

  const [editorWidth, setEditorWidth] = useState(props.editor.domElement.firstElementChild!.clientWidth);
  const [width, setWidth] = useState(() => parseFloat(props.block.props.width));

  const updateWidth = useMemo(
    () => (newWidth: number) => {
      newWidth = newWidth / editorWidth;
      if (newWidth < minWidth) {
        setWidth(minWidth);
      } else if (newWidth > maxWidth) {
        setWidth(maxWidth);
      } else {
        setWidth(newWidth);
      }
    },
    [editorWidth]
  );

  useEffect(() => {
    const mouseUpHandler = () => {
      setResizeHandle(null);
      props.editor.updateBlock(props.block, {
        type: 'image',
        props: {
          width: width.toString()
        }
      });
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!resizeHandle) return;

      if (textAlignmentToAlignItems(props.block.props.textAlignment) === 'center') {
        if (resizeHandle === 'left') {
          updateWidth(initialWidth + (initialClientX - e.clientX) * 2);
        } else {
          updateWidth(initialWidth + (e.clientX - initialClientX) * 2);
        }
      } else {
        if (resizeHandle === 'left') {
          updateWidth(initialWidth + initialClientX - e.clientX);
        } else {
          updateWidth(initialWidth + e.clientX - initialClientX);
        }
      }
    };

    const resizeHandler = () => {
      setEditorWidth(props.editor.domElement.firstElementChild!.clientWidth);
    };

    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [
    initialClientX,
    initialWidth,
    props.block,
    props.block.props.textAlignment,
    props.editor,
    props.editor.domElement.firstElementChild,
    resizeHandle,
    updateWidth,
    width
  ]);

  return (
    // Wrapper element to set the image alignment
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: textAlignmentToAlignItems(props.block.props.textAlignment),
        width: '100%'
      }}>
      {/*Wrapper element for the image and resize handles*/}
      {props.block.props.src && (
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            width: 'fit-content'
          }}>
          <img
            src={props.block.props.src}
            alt={'placeholder'}
            contentEditable={false}
            style={{
              display: props.block.props.replacing === 'true' ? 'none' : 'block',
              width: `${width * editorWidth}px`
            }}
          />
          {/*Left resize handle*/}
          <div
            onMouseDown={e => {
              e.preventDefault();
              setInitialWidth(width * editorWidth);
              setInitialClientX(e.clientX);
              setResizeHandle('left');
            }}
            style={{
              ...resizeHandleStyles,
              display: props.block.props.replacing === 'false' && (hovered || resizeHandle) ? 'block' : 'none',
              left: '4px'
            }}
          />
          {/*Right resize handle*/}
          <div
            onMouseDown={e => {
              e.preventDefault();
              setInitialWidth(width * editorWidth);
              setInitialClientX(e.clientX);
              setResizeHandle('right');
            }}
            style={{
              ...resizeHandleStyles,
              display: props.block.props.replacing === 'false' && (hovered || resizeHandle) ? 'block' : 'none',
              right: '4px'
            }}
          />
        </div>
      )}
    </div>
  );
};

const resizeHandleStyles: CSSProperties = {
  position: 'absolute',
  width: '8px',
  height: '30px',
  backgroundColor: 'black',
  border: '1px solid white',
  borderRadius: '4px',
  cursor: 'ew-resize'
};

export const ImageBlock = createReactBlockSpec({
  type: 'image',
  propSchema: {
    ...defaultProps,
    src: {
      default: 'https://via.placeholder.com/1000'
    }
  },
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

export const Image = createReactBlockSpec<
  'image',
  typeof imagePropSchema,
  false,
  BlockSchema & {
    image: BlockSpec<'image', typeof imagePropSchema>;
  }
>({
  type: 'image',
  propSchema: imagePropSchema,
  containsInlineContent: false,
  render: props => <ImageComponent {...props} />
});

export const insertImage = new ReactSlashMenuItem(
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
