import { Box } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MarkdownCell from '../Cells/Markdown/MarkdownCell';
import CodeCell from '../Cells/Code/CodeCell';
import AddCell from './AddCell';
import useNotebookContext from '../../contexts/NotebookContext';

const Cells = ({ roomID, cells, setCells }) => {
  const { repositionCell } = useNotebookContext();

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
  };

  return (
    <Box sx={{ mx: 5, py: 1 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='cells'>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {cells &&
                cells.map((cell, index) => {
                  const id = cell.get('id');
                  const type = cell.get('type');
                  const content = cell.get('content');
                  return (
                    <Draggable key={id} draggableId={id.toString()} index={index}>
                      {provided => (
                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Box display='flex' alignItems='center' flexDirection='row'>
                            {type === 'markdown' && <MarkdownCell id={id} content={content} />}
                            {type === 'code' && <CodeCell cellID={id} roomID={roomID} cell={cell} content={content} />}
                          </Box>
                          <AddCell index={index} type={type} />
                        </Box>
                      )}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {cells && cells.length === 0 && <AddCell index={0} />}
    </Box>
  );
};
export default Cells;
