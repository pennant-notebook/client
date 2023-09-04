import { createContext, useContext } from 'react';
import { NotebookContextType } from '~/utils/notebookHelpers';

export const NotebookContext = createContext<NotebookContextType | null>(null);

const useNotebookContext = (): NotebookContextType => {
  const context = useContext(NotebookContext);
  if (context === null) {
    throw new Error("useNotebookContext must be used within a Notebook Provider");
  }
  return context;
};

export default useNotebookContext;
