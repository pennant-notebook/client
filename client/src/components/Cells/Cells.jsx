import { useState } from 'react';

import { Box, DragIndicator, Stack, Typography } from '../../utils/MuiImports';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import MarkdownCell from '../Markdown/MarkdownCell';
import CodeCell from '../Code/CodeCell';
import AddCell from './AddCell';
import useNotebookContext from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import StrictModeDroppable from './StrictModeDroppable';

const Cells = ({ cells, setCells }) => {
  const { repositionCell } = useNotebookContext();
  const { provider } = useProviderContext();
  const [refreshCount, setRefreshCount] = useState(0);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = async result => {
    if (!result.destination) {
      return;
    }

    const items = reorder(cells, result.source.index, result.destination.index);
    setCells(items);

    const cell = cells[result.source.index];
    await repositionCell(cell, result.destination.index);
    setRefreshCount(count => count + 1);
  };

  return (
    <Box sx={{ py: 2, width: '75%', mx: 'auto' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId='cells'>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <AddCell index={-1} />
              {cells &&
                cells.map((cell, index) => {
                  const id = cell.get('id');
                  const type = cell.get('type');
                  const content = cell.get('content');
                  return (
                    <Box width='100%' key={id}>
                      <Draggable key={id} draggableId={id.toString()} index={index}>
                        {provided => (
                          <Box ref={provided.innerRef} {...provided.draggableProps}>
                            <Stack direction='row' alignItems='center' sx={{ my: '0px' }}>
                              <Box display='flex' alignItems='center' width='100%'>
                                <Box className='dragIndicator' {...provided.dragHandleProps}>
                                  <DragIndicator sx={{ opacity: '0.5', mt: 0.5 }} />
                                </Box>
                                <Box alignItems='center' sx={{ flexGrow: 1, zIndex: 0, ml: 2 }}>
                                  {type === 'markdown' && (
                                    <MarkdownCell
                                      id={id}
                                      content={content}
                                      provider={provider}
                                      cell={cell}
                                      refreshCount={refreshCount}
                                    />
                                  )}
                                  {type === 'code' && <CodeCell cellId={id} cell={cell} content={content} />}
                                </Box>
                              </Box>
                            </Stack>
                          </Box>
                        )}
                      </Draggable>
                      <AddCell index={index} type={type} />
                    </Box>
                  );
                })}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </Box>
  );
};

export default Cells;
