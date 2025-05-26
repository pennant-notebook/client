import { ProviderContextType } from "@/ProviderTypes";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import LoadingSpinner from "~/components/UI/loading/LoadingSpinner";
import { NavbarProvider } from "~/contexts/NavbarContext";
import { ProviderContext, useProvider } from "~/contexts/ProviderContext";
import { fetchDoc } from "~/services/dynamoFetch";
import ErrorBoundary from "../../ErrorBoundary";
import Navbar from "./navbar/Navbar";
import Notebook from "./Notebook";

const NotebookRoute = () => {
  const { username, docID } = useParams();
  const {
    data: notebook,
    isLoading,
    error,
  } = useQuery([docID, username], () => {
    if (!docID || !username) {
      return;
    }
    return fetchDoc(docID, username);
  });

  const contextValue = useProvider(docID || "demo") as ProviderContextType;

  if (isLoading || !notebook) return <LoadingSpinner />;
  if (error) return "Error!";

  return (
    <ProviderContext.Provider value={contextValue as ProviderContextType}>
      <ErrorBoundary>
        <NavbarProvider
          provider={contextValue.provider || null}
          docID={docID || ""}>
          <Navbar />
          {docID && (
            <Notebook
              resourceTitle={notebook.title}
              notebook={notebook}
            />
          )}
        </NavbarProvider>
      </ErrorBoundary>
    </ProviderContext.Provider>
  );
};

export default NotebookRoute;
