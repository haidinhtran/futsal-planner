import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add event listener
    mql.addEventListener('change', onChange);
    
    // Check on mount in case it changed
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return isMobile;
}