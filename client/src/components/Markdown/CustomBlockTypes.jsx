import { InlineContent, createReactBlockSpec } from '@blocknote/react';
import { defaultProps } from '@blocknote/core';

export const TableBlock = createReactBlockSpec({
  type: 'table',
  propSchema: {
    ...defaultProps,
    data: {
      default: JSON.stringify([
        ['Header 1', 'Header 2'],
        ['Row 1', 'Row 2']
      ])
    }
  },
  containsInlineContent: true,
  render: ({ block }) => {
    const tableData = JSON.parse(block.props.data);

    return (
      <table>
        {tableData.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
        <InlineContent />
      </table>
    );
  }
});

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
