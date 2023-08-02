import { Box, DragIndicator, Stack } from '../../utils/MuiImports';
import { Draggable } from 'react-beautiful-dnd';
import MarkdownCell from '../Markdown/MarkdownCell';
import CodeCell from '../Code/CodeCell';
import AddCell from './AddCell';
import { CellPosAvatar } from '../UI/StyledComponents';
import { useState } from 'react';
import { getUserObjects } from '../../utils/notebookHelpers';

const CellRow = ({ index, cell, refreshCount, isDragging }) => {
  const [isEditing, setIsEditing] = useState(false);

  const id = cell.get('id');
  const type = cell.get('type');
  const content = cell.get('content');

  return (
    <Box width='100%'>
      <Draggable key={`${id}-${refreshCount}`} draggableId={id.toString()} index={index} isDragDisabled={isEditing}>
        {provided => (
          <Box ref={provided.innerRef} {...provided.draggableProps}>
            <Stack direction='row' alignItems='center' sx={{ my: '0px' }}>
              <Box display='flex' alignItems='center' width='100%'>
                <Box className='dragIndicator' {...provided.dragHandleProps}>
                  <DragIndicator
                    sx={{
                      opacity: isEditing ? '0.75' : '0.5',
                      mt: 0.5,
                      transform: 'rotate(90deg)'
                    }}
                  />
                </Box>
                <Box
                  alignItems='center'
                  sx={{ flexGrow: 1, position: 'relative' }}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}>
                  {type === 'markdown' && <MarkdownCell id={id} content={content} cell={cell} />}
                  {type === 'code' && <CodeCell key={`${id}`} cellId={id} cell={cell} content={content} />}
                  <CellPosAvatar pos={cell.get('pos')} />
                </Box>
              </Box>
            </Stack>
          </Box>
        )}
      </Draggable>
      <AddCell index={index} isDragging={isDragging} />
    </Box>
  );
};

export default CellRow;
