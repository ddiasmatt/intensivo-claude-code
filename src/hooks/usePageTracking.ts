import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Small delay to let react-helmet-async update the document title first
    const timeout = setTimeout(() => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'G-7CJMYD129G', {
          page_path: location.pathname + location.search,
          page_title: document.title,
        });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [location]);
};
