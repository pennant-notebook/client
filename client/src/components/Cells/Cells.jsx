import { useRef, useState } from 'react';
import { Box, useTheme } from '../../utils/MuiImports';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddCell from './AddCell';
import useNotebookContext from '../../contexts/NotebookContext';
import CellRow from './CellRow';

const Cells = ({ cells, setCells }) => {
  const { repositionCell, refreshCount } = useNotebookContext();
  const theme = useTheme().palette.mode;

  const [isDragging, setIsDragging] = useState(false);
  const cellRefs = useRef({});

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = async result => {
    setIsDragging(false);

    if (!result.destination) {
      return;
    }

    const items = reorder(cells, result.source.index, result.destination.index);
    setCells(items);

    const cell = cells[result.source.index];
    await repositionCell(cell, result.destination.index);

    const cellId = cells[result.source.index].get('id');
    const draggedCellRef = cellRefs.current[cellId];
    if (draggedCellRef) {
      draggedCellRef.focus();
    }
  };

  return (
    <Box sx={{ py: 2, width: '100%', mx: 'auto' }}>
      <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={onDragEnd}>
        <AddCell index={-1} noCells={cells.length < 1} isDragging={isDragging} />
        <Box sx={{ width: '100%', mx: 'auto' }}>
          <Droppable droppableId='cells'>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {cells &&
                  cells.map((cell, index) => {
                    const id = cell.get('id');
                    return (
                      <Draggable key={`${id}-${refreshCount}`} draggableId={id.toString()} index={index}>
                        {(provided, snapshot) => {
                          let transform = provided.draggableProps.style.transform;
                          if (snapshot.isDragging && transform) {
                            transform = transform.replace(/\(.+\,/, '(0,');
                          }
                          const style = {
                            ...provided.draggableProps.style,
                            transform
                          };
                          return (
                            <div ref={provided.innerRef} {...provided.draggableProps} style={style}>
                              <Box sx={{ position: 'relative', display: 'flex' }}>
                                <Box
                                  {...provided.dragHandleProps}
                                  className={`${'draggable-container'} ${theme} cell-drag-handle`}
                                  sx={{ width: '25%' }}
                                />
                                <CellRow
                                  cell={cell}
                                  refreshCount={refreshCount}
                                  index={index}
                                  reportRef={ref => {
                                    if (cell.get('type') === 'code') {
                                      cellRefs.current[cell.get('id')] = ref;
                                    }
                                  }}
                                />
                              </Box>

                              <AddCell index={index} isDragging={isDragging} />
                            </div>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default Cells;
