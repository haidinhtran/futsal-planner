import React, { createContext, use, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TopbarContextType {
  topbarContent: ReactNode;
  setTopbarContent: (content: ReactNode) => void;
}

const TopbarContext = createContext<TopbarContextType | undefined>(undefined);

export const TopbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topbarContent, setTopbarContent] = useState<ReactNode>(null);

  return (
    <TopbarContext.Provider value={{ topbarContent, setTopbarContent }}>
      {children}
    </TopbarContext.Provider>
  );
};

/**
 * React 19 Standard: Dùng hook use() thay cho useContext()
 */
export const useTopbar = () => {
  const context = use(TopbarContext);
  if (!context) {
    throw new Error('useTopbar must be used within a TopbarProvider');
  }
  return context;
};

/**
 * TopbarPortal component: Render bất kỳ children elements trực tiếp vào Topbar slot qua React Portal.
 */
export const TopbarPortal: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalElement(document.getElementById('topbar-portal-root'));
  }, []);

  if (!portalElement) return null;
  return createPortal(children, portalElement);
};
