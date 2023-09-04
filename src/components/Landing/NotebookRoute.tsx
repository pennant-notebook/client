import { useParams } from 'react-router-dom';
import { ProviderContext, useProvider } from '../../contexts/ProviderContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import Notebook from '../Notebook/Notebook';
import ErrorBoundary from '../../ErrorBoundary';
import { fetchDoc } from '../../services/dynamoFetch';
import { useQuery } from 'react-query';
import { ProviderContextType } from '~/utils/notebookHelpers';

const NotebookRoute = () => {
  const { username, docID } = useParams();
  const {
    data: notebook,
    isLoading,
    error
  } = useQuery([docID, username], () => {
    if (!docID || !username) {
      return;
    }
    return fetchDoc(docID, username);
  });

  const contextValue = useProvider(docID!);

  if (isLoading || !notebook) return <LoadingSpinner />;
  if (error) return 'Error!';

  return (
    <ProviderContext.Provider value={contextValue as ProviderContextType}>
      <ErrorBoundary>{docID && <Notebook docID={docID} resourceTitle={notebook.title} />}</ErrorBoundary>
    </ProviderContext.Provider>
  );
};

export default NotebookRoute;
