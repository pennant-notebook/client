import { CellType } from '@/CellTypes';
import { useState, SetStateAction, Dispatch } from 'react';
import useNotebookContext from '../../contexts/NotebookContext';
import { Box } from '../../utils/MuiImports';
import AddCell from './AddCell';
import CellRow from './CellRow';
import DraggableCells from './DraggableCells';
import '../../styles/App.css';

interface CellsProps {
  cells: CellType[];
  setCells: Dispatch<SetStateAction<CellType[]>>;
}

const Cells = ({ cells, setCells }: CellsProps) => {
  const { repositionCell } = useNotebookContext();

  const [isDragging, setIsDragging] = useState(false);

  const reorder = (list: CellType[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = async (sourceIndex: number, destinationIndex: number) => {
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
