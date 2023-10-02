import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ProviderContext, useProvider } from '~/contexts/ProviderContext';
import LeftSidebar from '~/components/Dashboard/tree/LeftSidebar';
import { ProviderContextType } from '@/ProviderTypes';
import { fetchDoc, fetchNotebooks } from '~/services/dynamoFetch';
import { NotebookType } from '@/NotebookTypes';
import Notebook from '../Notebook/Notebook';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import Navbar from '../Notebook/navbar/Navbar';
import LoadingSpinner from '../UI/loading/LoadingSpinner';
import { updateDisconnectedClient } from '~/utils/awarenessHelpers';
import { NavbarProvider } from '~/contexts/NavbarContext';
import { Box } from '~/utils/MuiImports';

const DashboardWrapper = () => {
  const { username } = useParams();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const navigate = useNavigate();
  const usernameFromLocal = localStorage.getItem('pennant-username');
  const authToken = localStorage.getItem('pennantAccessToken');

  const {
    data: notebook,
    isLoading,
    error
  } = useQuery([selectedDocId, username], () => {
    if (!selectedDocId || !username) {
      return;
    }
    return fetchDoc(selectedDocId, username);
  });

  if (!username) return null;

  const {
    data: notebooks,
    refetch,
    isLoading: loading,
    isError: errorFetchingNotebooks
  } = useQuery<NotebookType[], Error>(['notebooks', username], () => fetchNotebooks(username), {
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (username === '@trypennant') return;
    if (!authToken || usernameFromLocal !== username.slice(1)) {
      const errorMsg = authToken ? 'You are not authorized to view this page.' : 'Please login to view this page.';
      toast.error(errorMsg);
      navigate('/auth');
    }
  }, [username]);

  const contextValue = useProvider(selectedDocId || 'demo') as ProviderContextType;

  if (loading) return <LoadingSpinner />;
  if (errorFetchingNotebooks) return 'Error!';

  const handleSelectedDocId = (docId: string) => {
    setSelectedDocId(docId);
    updateDisconnectedClient(contextValue.provider);
  };

  const lang = contextValue.notebookMetadata.get('language');

  return (
    <ProviderContext.Provider value={contextValue}>
      <NavbarProvider provider={contextValue.provider || null} docID={selectedDocId || ''}>
        <Box>
          <Navbar selectedDoc={selectedDocId || ''} language={lang} />
          <LeftSidebar
            username={username}
            notebooks={notebooks}
            refetch={refetch}
            setSelectedDocId={handleSelectedDocId}
          />
          {selectedDocId && notebook && !isLoading && !error && (
            <Notebook docID={selectedDocId} resourceTitle={notebook.title} notebook={notebook} />
          )}
        </Box>
      </NavbarProvider>
    </ProviderContext.Provider>
  );
};

export default DashboardWrapper;
