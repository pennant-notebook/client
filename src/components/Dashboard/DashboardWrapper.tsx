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
import { useRecoilState, useSetRecoilState } from 'recoil';
import { notebooksState, selectedDocIdState } from '~/appState';

const DashboardWrapper = () => {
  const { username } = useParams();
  const [isLoadingSelectedNotebook, setIsLoadingSelectedNotebook] = useState(false);
  const [selectedDocId, setSelectedDocId] = useRecoilState(selectedDocIdState);
  const navigate = useNavigate();
  const usernameFromLocal = localStorage.getItem('pennant-username');
  const authToken = localStorage.getItem('pennantAccessToken');
  const setNotebooks = useSetRecoilState(notebooksState);

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
    if (!notebooks) return;
    setNotebooks(notebooks);
  }, [notebooks]);

  useEffect(() => {
    if (username === '@trypennant' || username === 'documentation') return;
    if (!authToken || usernameFromLocal !== username.slice(1)) {
      const errorMsg = authToken ? 'You are not authorized to view this page.' : 'Please login to view this page.';
      toast.error(errorMsg);
      navigate('/auth');
    }
  }, [username]);

  const contextValue = useProvider(selectedDocId || 'demo') as ProviderContextType;

  if (loading) return <LoadingSpinner />;
  if (errorFetchingNotebooks) return 'Error!';

  const handleSelectedDocId = async (docId: string) => {
    setIsLoadingSelectedNotebook(true);
    setSelectedDocId(docId);
    await updateDisconnectedClient(contextValue.provider);
    setIsLoadingSelectedNotebook(false);
  };

  return (
    <ProviderContext.Provider value={contextValue}>
      <NavbarProvider provider={contextValue.provider || null} docID={selectedDocId || ''}>
        <Box>
          <Navbar selectedDoc={selectedDocId!} />
          <LeftSidebar username={username} refetch={refetch} handleSelectedDocId={handleSelectedDocId} />
          {!isLoadingSelectedNotebook && selectedDocId && notebook && !isLoading && !error && (
            <Notebook docID={selectedDocId} resourceTitle={notebook.title} notebook={notebook} />
          )}
        </Box>
      </NavbarProvider>
    </ProviderContext.Provider>
  );
};

export default DashboardWrapper;
