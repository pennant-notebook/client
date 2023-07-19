import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ProviderContext, initializeProvider } from '../../contexts/ProviderContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import Notebook from '../Notebook/Notebook';
import { fetchDocFromDynamo } from '../../services/dynamo';
import { resetClients } from '../../utils/awarenessHelpers';

export const NotebookRoute = () => {
  const [notebook, setNotebook] = useState(null);
  const [contextValue, setContextValue] = useState(null);
  const { username, docID } = useParams();

  useEffect(() => {
    const fetchNotebook = async () => {
      const fetchedNotebook = await fetchDocFromDynamo(username, docID);
      setNotebook(fetchedNotebook);
    };

    fetchNotebook();
  }, [docID]);

  useEffect(() => {
    if (notebook) {
      const value = initializeProvider(notebook.docID, username.substring(1));
      setContextValue(value);
      // const { provider } = value;
      // resetClients(provider);
      // console.log(provider);
    }
  }, [notebook]);

  if (!contextValue) {
    return <LoadingSpinner />;
  }

  return (
    <ProviderContext.Provider value={contextValue}>
      <Suspense fallback={<LoadingSpinner />}>
        <Notebook docID={docID} />
      </Suspense>
    </ProviderContext.Provider>
  );
};
