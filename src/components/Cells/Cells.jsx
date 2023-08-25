import { useState } from 'react';
import { Box } from '../../utils/MuiImports';
import AddCell from './AddCell';
import useNotebookContext from '../../contexts/NotebookContext';
import CellRow from './CellRow';
import DraggableCells from './DraggableCells';

const Cells = ({ cells, setCells }) => {
  const { repositionCell } = useNotebookContext();

  const [isDragging, setIsDragging] = useState(false);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = async (sourceIndex, destinationIndex) => {
    setIsDragging(false);

    if (sourceIndex === destinationIndex) {
      return;
    }

    const items = reorder(cells, sourceIndex, destinationIndex);
    setCells(items);

    const cell = cells[sourceIndex];
    await repositionCell(cell, destinationIndex);
  };

  return (
    <Box sx={{ py: 2, width: '100%', mx: 'auto' }}>
      <Box sx={{ width: '100%', mx: 'auto' }}>
        <div className='cellList'>
          <Box sx={{ position: 'relative', width: '100%' }}>
            <AddCell index={-1} noCells={cells.length < 1} isDragging={isDragging} />

            {cells &&
              cells.map((cell, i) => (
                <div key={cell.get('id')}>
                  <DraggableCells index={i} onDragEnd={onDragEnd}>
                    <CellRow cell={cell} index={i} />
                  </DraggableCells>
                  <AddCell index={i} isDragging={isDragging} />
                </div>
              ))}
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default Cells;
