import { useReducer, useRef, useState } from 'react';
import { Box } from '../../utils/MuiImports';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AddCell from './AddCell';
import useNotebookContext from '../../contexts/NotebookContext';
import CellRow from './CellRow';

const Cells = ({ cells, setCells }) => {
  const { repositionCell, incrementLineRefresh } = useNotebookContext();
  const [refreshCount, incrementRefreshCount] = useReducer(count => count + 1, 0);
  const [isDragging, setIsDragging] = useState(false);
  const cellRefs = useRef({});

  const onDragStart = () => {
    setIsDragging(true);
  };

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

    incrementRefreshCount();
    incrementLineRefresh();

    const cellId = cells[result.source.index].get('id');
    const draggedCellRef = cellRefs.current[cellId];
    if (draggedCellRef) {
      draggedCellRef.focus();
    }
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
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <AddCell index={-1} isDragging={isDragging} />
        <Droppable droppableId='cells'>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {cells &&
                cells.map((cell, index) => {
                  return (
                    <CellRow
                      key={cell.get('id')}
                      cell={cell}
                      index={index}
                      refreshCount={refreshCount}
                      getStartingLineNumber={getStartingLineNumber}
                      isDragging={isDragging}
                      reportRef={ref => {
                        if (cell.get('type') === 'code') {
                          cellRefs.current[cell.get('id')] = ref;
                        }
                      }}
                    />
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
