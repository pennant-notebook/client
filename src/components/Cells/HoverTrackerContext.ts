import { createContext } from 'react';

interface HoverTrackerContextProps {
  setHover: (hover: boolean) => void;
}

export const HoverTrackerContext = createContext<HoverTrackerContextProps>({
  setHover: () => { }
});
