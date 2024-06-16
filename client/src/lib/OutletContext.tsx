import React, { createContext, useContext, useState } from 'react';

type OutletContextType = {
  component: string;
  setComponent: (component: string) => void;
};

const OutletContext = createContext<OutletContextType | undefined>(undefined);

export const OutletProvider: React.FC = ({ children }) => {
  const [component, setComponent] = useState<string>(''); // Initialize with appropriate default

  return (
    <OutletContext.Provider value={{ component, setComponent }}>
      {children}
    </OutletContext.Provider>
  );
};

export const useOutletContext = () => {
  const context = useContext(OutletContext);
  if (!context) {
    throw new Error('useOutletContext must be used within an OutletProvider');
  }
  return context;
};
