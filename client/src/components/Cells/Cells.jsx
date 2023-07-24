import { useReducer } from 'react';
import { Box, DragIndicator, Stack } from '../../utils/MuiImports';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import MarkdownCell from '../Markdown/MarkdownCell';
import CodeCell from '../Code/CodeCell';
import AddCell from './AddCell';
import useNotebookContext from '../../contexts/NotebookContext';
import useProviderContext from '../../contexts/ProviderContext';
import { CellPosAvatar } from '../UI/StyledBadge';

const Cells = ({ cells, setCells }) => {
  const { repositionCell, lineRefresh, incrementLineRefresh } = useNotebookContext();
  const { provider } = useProviderContext();
  const [refreshCount, incrementRefreshCount] = useReducer(count => count + 1, 0);

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

    incrementRefreshCount();
    incrementLineRefresh();
  };

  const getStartingLineNumber = index => {
    const codeCells = cells.filter(c => c.get('type') === 'code');

    const lineCounts = codeCells.map(c => c.get('content').toString().split('\n').length);

    const codeCellIndex = codeCells.findIndex(c => c.get('pos') === index);

    if (codeCellIndex === -1) {
      return undefined;
    }

    const totalLineCount = lineCounts.slice(0, codeCellIndex).reduce((a, b) => a + b, 0);
    return totalLineCount + 1;
  };

  return (
    <Box sx={{ py: 2, width: '75%', mx: 'auto' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <AddCell index={-1} />
        <Droppable droppableId='cells'>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
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
                                <Box alignItems='center' sx={{ flexGrow: 1, position: 'relative' }}>
                                  {type === 'markdown' && (
                                    <MarkdownCell
                                      id={id}
                                      content={content}
                                      provider={provider}
                                      cell={cell}
                                      refreshCount={refreshCount}
                                    />
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
                      <AddCell index={index} type={type} />
                    </Box>
                  );
                })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default Cells;
