import { useRef, useState, ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HoverTrackerContext } from './HoverTrackerContext';
import styles from './Draggable.module.css';
import { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

interface DragItem {
  type: string;
  index: number;
}

interface DraggableCellsProps {
  index: number;
  onDragEnd: (sourceIndex: number, destinationIndex: number) => void;
  children: ReactNode;
}

const DraggableCells = ({ index, onDragEnd, children }: DraggableCellsProps) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'CELL', index: index },
    type: 'CELL',
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const ref = useRef<HTMLDivElement>(null);
  const dragSourceRef = useRef(null);
  const [dndHoverPos, setDndHoverPos] = useState('top');

  function calcDrag(item: DragItem, monitor: DragSourceMonitor | DropTargetMonitor) {
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
    const hoverClientY = clientOffset ? clientOffset.y - hoverBoundingRect.top : 0;

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
      const hoverClientY = clientOffset && clientOffset.y - hoverBoundingRect.top;

      setDndHoverPos(hoverClientY && hoverClientY < hoverMiddleY ? 'top' : 'bottom');
    },
    drop: (item, monitor) => {
      const calc = calcDrag(item as DragItem, monitor);
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
        className={`${styles['cellList-item']} ${childHovering || hovering ? 'hover' : ''}`}
        ref={ref}
        style={{ opacity }}
        onMouseOver={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}>
        {dndHovered && dndHoverPos === 'top' && <div className={styles['dropruler.top']} />}
        <div className={styles['shoulder']} draggable='true' ref={dragSourceRef}></div>
        {children}
        {dndHovered && dndHoverPos === 'bottom' && <div className={styles['dropruler.bottom']} />}
      </div>
    </HoverTrackerContext.Provider>
  );
};

export default DraggableCells;
