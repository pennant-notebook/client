import { memo, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HoverTrackerContext } from './HoverTrackerContext';
import './Draggable.css';

const DraggableCells = memo(({ index, onDragEnd, children }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'CELL', index: index },
    type: 'CELL',
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const ref = useRef(null);
  const dragSourceRef = useRef(null);
  const [dndHoverPos, setDndHoverPos] = useState('top');

  function calcDrag(item, monitor) {
    if (!ref.current) {
      return;
    }
    const dragIndex = item.index;
    let hoverIndex = index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = ref.current.getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      hoverIndex--;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      hoverIndex++;
    }

    if (hoverIndex === dragIndex) {
      return;
    }

    return {
      dragIndex,
      hoverIndex
    };
  }

  const [{ hovered: dndHovered }, drop] = useDrop({
    accept: 'CELL',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      setDndHoverPos(hoverClientY < hoverMiddleY ? 'top' : 'bottom');
    },
    drop: (item, monitor) => {
      const calc = calcDrag(item, monitor);
      if (!calc) {
        return;
      }
      onDragEnd(calc.dragIndex, calc.hoverIndex);
    },
    collect: monitor => ({
      hovered: monitor.isOver()
    })
  });

  const opacity = isDragging ? 1 : 1;
  drag(dragSourceRef, {});
  drop(ref);

  const [hovering, setHovering] = useState(false);
  const [childHovering, setChildHovering] = useState(false);

  return (
    <HoverTrackerContext.Provider
      value={{
        setHover: hover => {
          setChildHovering(hover);
        }
      }}>
      <div
        className={'cellList-item ' + (childHovering || hovering ? 'hover' : '')}
        ref={ref}
        style={{ opacity }}
        onMouseOver={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}>
        {dndHovered && dndHoverPos === 'top' && <div className='dropruler top' />}
        <div className='shoulder' draggable='true' ref={dragSourceRef}></div>
        {children}
        {dndHovered && dndHoverPos === 'bottom' && <div className='dropruler bottom' />}
      </div>
    </HoverTrackerContext.Provider>
  );
});

export default DraggableCells;
