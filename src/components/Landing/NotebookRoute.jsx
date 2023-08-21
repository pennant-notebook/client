import { useParams } from 'react-router-dom';
import { ProviderContext, useProvider } from '../../contexts/ProviderContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import Notebook from '../Notebook/Notebook';
import ErrorBoundary from '../../ErrorBoundary';
import { fetchDoc } from '../../services/dynamoFetch';
import { useQuery } from 'react-query';

const NotebookRoute = () => {
  const { username, docID } = useParams();
  const { data: notebook, loading, error } = useQuery([docID, username], () => fetchDoc(docID, username));
  const contextValue = useProvider(docID);

  if (loading || !notebook) return <LoadingSpinner />;
  if (error) return 'Error!';

  return (
    <ProviderContext.Provider value={contextValue}>
      <ErrorBoundary>
        <Notebook docID={docID} resourceTitle={notebook.title} />
      </ErrorBoundary>
    </ProviderContext.Provider>
  );
};

export default NotebookRoute;
