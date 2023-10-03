import { ClientType } from '@/ClientTypes';
import { HocuspocusProviderConfig } from '@/ProviderTypes';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { updateDisconnectedClient } from '~/utils/awarenessHelpers';

interface NavbarContextType {
  codeCells: any[];
  setCodeCells: React.Dispatch<React.SetStateAction<any[]>>;
  handleDisconnect: (destination: string) => void;
  clients: any[];
  setClients: React.Dispatch<React.SetStateAction<any[]>>;
  selectedDoc: string;
  setSelectedDoc: React.Dispatch<React.SetStateAction<string>>;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const useNavbarContext = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbarContext must be used within a NavbarProvider');
  }
  return context;
};

interface NavbarProviderProps {
  children: React.ReactNode;
  provider?: HocuspocusProviderConfig;
  docID?: string;
}

export const NavbarProvider = ({ children, provider, docID }: NavbarProviderProps) => {
  const [codeCells, setCodeCells] = useState<any[]>([]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const navigate = useNavigate();

  const handleDisconnect = async (destination: string) => {
    if (docID && provider) {
      const currentClients = await updateDisconnectedClient(provider);
      setClients(currentClients || []);
    }
    navigate(destination);
  };

  const contextValue = {
    codeCells,
    setCodeCells,
    handleDisconnect,
    clients,
    setClients,
    selectedDoc,
    setSelectedDoc
  };

  return <NavbarContext.Provider value={contextValue}>{children}</NavbarContext.Provider>;
};
