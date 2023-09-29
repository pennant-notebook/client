import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createCell } from '~/utils/notebookHelpers';
import Cells from '~/components/Cells/Cells';
import { expect, test } from 'vitest';
import { NotebookContext } from '~/contexts/NotebookContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const notebookContextValues = {
  addCellAtIndex: () => {},
  repositionCell: () => {},
  deleteCell: () => {},
  title: 'Test Title',
  handleTitleChange: () => {},
  allRunning: false,
  setAllRunning: () => {}
};

test('it renders the correct number of cells', () => {
  const cell1 = createCell('code', 'javascript');
  const cell2 = createCell('markdown');
  const mockCells = [cell1, cell2];

  const { container } = render(
    <NotebookContext.Provider value={notebookContextValues}>
      <DndProvider backend={HTML5Backend}>
        <Cells cells={mockCells} setCells={() => {}} />
      </DndProvider>
    </NotebookContext.Provider>
  );
  expect(container.querySelectorAll('.cell')).toHaveLength(mockCells.length);
});
