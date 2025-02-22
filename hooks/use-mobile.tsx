'use client';
import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Default to non-mobile for SSR
  const [isMobile, setIsMobile] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }
    };

    if (typeof window !== 'undefined') {
      // Set initial value
      handleResize();

      // Add event listeners
      window.addEventListener('resize', handleResize);
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      mql.addEventListener('change', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        mql.removeEventListener('change', handleResize);
      };
    }
  }, []);

  // Return SSR-friendly default if not mounted
  if (!isMounted) {
    return false; // Default to desktop view during SSR
  }

  return isMobile;
}
