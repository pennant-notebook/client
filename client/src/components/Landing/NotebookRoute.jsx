import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ProviderContext, initializeProvider } from '../../contexts/ProviderContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import Notebook from '../Notebook/Notebook';
import { fetchDocFromDynamo } from '../../services/dynamo';
import ErrorBoundary from '../../ErrorBoundary';

export const NotebookRoute = () => {
  const [notebook, setNotebook] = useState(null);
  const [contextValue, setContextValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username, docID } = useParams();

  useEffect(() => {
    const fetchNotebook = async () => {
      const fetchedNotebook = await fetchDocFromDynamo(docID, username);
      setNotebook(fetchedNotebook);
      if (!fetchedNotebook) {
        setLoading(false);
      }
    };

    fetchNotebook();
  }, [docID]);

  useEffect(() => {
    if (notebook) {
      const value = initializeProvider(notebook.docID, username);
      setContextValue(value);
      setLoading(false);
    }
  }, [notebook]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!contextValue) {
    return (
      <div>
        <h2>Notebook not found</h2>
      </div>
    );
  }
  return (
    <ErrorBoundary>
      <ProviderContext.Provider value={contextValue}>
        <Suspense fallback={<LoadingSpinner />}>
          <Notebook docID={docID} />
        </Suspense>
      </ProviderContext.Provider>
    </ErrorBoundary>
  );
};
