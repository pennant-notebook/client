import { createContext, useContext } from 'react';

export const NotebookContext = createContext();

const useNotebookContext = () => useContext(NotebookContext);

export default useNotebookContext;
