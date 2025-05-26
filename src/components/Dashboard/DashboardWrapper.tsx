import { NotebookType } from "@/NotebookTypes";
import { ProviderContextType } from "@/ProviderTypes";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";
import { notebooksState, selectedDocIdState } from "~/appState";
import LeftSidebar from "~/components/Dashboard/tree/LeftSidebar";
import { NavbarProvider } from "~/contexts/NavbarContext";
import { ProviderContext, useProvider } from "~/contexts/ProviderContext";
import { fetchDoc, fetchNotebooks } from "~/services/dynamoFetch";
import { updateDisconnectedClient } from "~/utils/awarenessHelpers";
import { Box } from "~/utils/MuiImports";
import Navbar from "../Notebook/navbar/Navbar";
import Notebook from "../Notebook/Notebook";
import LoadingSpinner from "../UI/loading/LoadingSpinner";

const DashboardWrapper = () => {
  const { username } = useParams();
  const [isLoadingSelectedNotebook, setIsLoadingSelectedNotebook] = useState(false);
  const [selectedDocId, setSelectedDocId] = useRecoilState(selectedDocIdState);
  const navigate = useNavigate();
  const usernameFromLocal = localStorage.getItem("pennant-username");
  const authToken = localStorage.getItem("pennantAccessToken");
  const setNotebooks = useSetRecoilState(notebooksState);

  // Always call hooks unconditionally
  const {
    data: notebook,
    isLoading,
    error,
  } = useQuery(
    [selectedDocId, username],
    () => {
      if (!selectedDocId || !username) {
        return;
      }
      return fetchDoc(selectedDocId, username);
    },
    {
      enabled: !!selectedDocId && !!username,
    }
  );

  const {
    data: notebooks,
    refetch,
    isLoading: loading,
    isError: errorFetchingNotebooks,
  } = useQuery<NotebookType[], Error>(["notebooks", username], () => fetchNotebooks(username!), {
    refetchOnWindowFocus: false,
    enabled: !!username,
  });

  useEffect(() => {
    if (!notebooks) return;
    setNotebooks(notebooks);
  }, [notebooks, setNotebooks]);

  useEffect(() => {
    if (username === "@trypennant" || username === "documentation") return;
    if (!authToken || usernameFromLocal !== username?.slice(1)) {
      const errorMsg = authToken
        ? "You are not authorized to view this page."
        : "Please login to view this page.";
      toast.error(errorMsg);
      navigate("/auth");
    }
  }, [authToken, navigate, usernameFromLocal, username]);

  const contextValue = useProvider(selectedDocId || "demo") as ProviderContextType;

  // Early returns after all hooks
  if (!username) return null;

  if (loading) return <LoadingSpinner />;
  if (errorFetchingNotebooks) return "Error!";

  const handleSelectedDocId = async (docId: string) => {
    setIsLoadingSelectedNotebook(true);
    setSelectedDocId(docId);
    await updateDisconnectedClient(contextValue.provider);
    setIsLoadingSelectedNotebook(false);
  };

  return (
    <ProviderContext.Provider value={contextValue}>
      <NavbarProvider
        provider={contextValue.provider || null}
        docID={selectedDocId || ""}>
        <Box>
          <Navbar selectedDoc={selectedDocId!} />
          <LeftSidebar
            username={username}
            refetch={refetch}
            handleSelectedDocId={handleSelectedDocId}
          />
          {!isLoadingSelectedNotebook && selectedDocId && notebook && !isLoading && !error && (
            <Notebook
              resourceTitle={notebook.title}
              notebook={notebook}
            />
          )}
        </Box>
      </NavbarProvider>
    </ProviderContext.Provider>
  );
};

export default DashboardWrapper;
