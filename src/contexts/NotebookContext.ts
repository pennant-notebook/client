import { NotebookContextType } from '@/NotebookTypes';
import { createContext, useContext } from 'react';

export const NotebookContext = createContext<NotebookContextType | null>(null);

const useNotebookContext = (): NotebookContextType => {
  const context = useContext(NotebookContext);
  if (context === null) {
    throw new Error("useNotebookContext must be used within a Notebook Provider");
  }
  return context;
};

export default useNotebookContext;
