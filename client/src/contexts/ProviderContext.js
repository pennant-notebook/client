import { createContext, useContext } from "react";

export const ProviderContext = createContext();

const useProviderContext = () => useContext(ProviderContext);

export default useProviderContext;
