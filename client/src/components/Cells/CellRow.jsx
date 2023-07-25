import { Box, DragIndicator, Stack } from '../../utils/MuiImports';
import { Draggable } from 'react-beautiful-dnd';
import MarkdownCell from '../Markdown/MarkdownCell';
import CodeCell from '../Code/CodeCell';
import AddCell from './AddCell';
import { CellPosAvatar } from '../UI/StyledBadge';
import useNotebookContext from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { useState } from 'react';
import { getUserObjects } from '../../utils/notebookHelpers';

const CellRow = ({ index, cell, refreshCount, getStartingLineNumber, isDragging }) => {
  const { awareness } = useProviderContext();
  const { lineRefresh } = useNotebookContext();
  const [isEditing, setIsEditing] = useState(false);

  const id = cell.get('id');
  const type = cell.get('type');
  const content = cell.get('content');

  const users = getUserObjects(awareness.getStates());
  const currentUser = users[0];

  return (
    <Box width='100%'>
      <Draggable key={id} draggableId={id.toString()} index={index} isDragDisabled={isEditing}>
        {provided => (
          <Box ref={provided.innerRef} {...provided.draggableProps}>
            <Stack direction='row' alignItems='center' sx={{ my: '0px' }}>
              <Box display='flex' alignItems='center' width='100%'>
                <Box className='dragIndicator' {...provided.dragHandleProps}>
                  <DragIndicator
                    sx={{
                      opacity: isEditing ? '1' : '0.5',
                      mt: 0.5,
                      transform: 'rotate(90deg)',
                      color: isEditing ? currentUser.color : 'normal'
                    }}
                  />
                </Box>
                <Box
                  alignItems='center'
                  sx={{ flexGrow: 1, position: 'relative' }}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}>
                  {type === 'markdown' && (
                    <MarkdownCell id={id} content={content} cell={cell} refreshCount={refreshCount} />
                  )}
                  {type === 'code' && (
                    <CodeCell
                      key={`${id}-${lineRefresh}`}
                      cellId={id}
                      cell={cell}
                      content={content}
                      getStartingLineNumber={getStartingLineNumber}
                    />
                  )}
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