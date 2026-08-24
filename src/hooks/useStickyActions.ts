import { useEffect, useState, useRef } from 'react';

export const useStickyActions = (rootId: string = 'main-scroll-container', threshold: number = 0) => {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const rootEl = document.getElementById(rootId);
    
    // We observe the sentinel element. If it goes out of view at the top, we enable sticky actions.
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the element is not intersecting, and its bounding rect is above the root rect (or viewport), it scrolled up.
        // Actually, just checking if it is intersecting is usually enough if we place the sentinel right where we want it to trigger.
        setIsSticky(!entry.isIntersecting && entry.boundingClientRect.y <= 0);
      },
      {
        root: rootEl,
        threshold: threshold,
        rootMargin: '0px'
      }
    );

    observer.observe(sentinelEl);

    return () => {
      observer.unobserve(sentinelEl);
      observer.disconnect();
    };
  }, [rootId, threshold]);

  return { isSticky, sentinelRef };
};
