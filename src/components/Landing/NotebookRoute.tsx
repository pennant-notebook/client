import { ProviderContextType } from '@/ProviderTypes';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import ErrorBoundary from '../../ErrorBoundary';
import { ProviderContext, useProvider } from '~/contexts/ProviderContext';
import { fetchDoc } from '~/services/dynamoFetch';
import Notebook from '../Notebook/Notebook';
import LoadingSpinner from '../UI/LoadingSpinner';

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
