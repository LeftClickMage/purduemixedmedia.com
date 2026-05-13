import { useEffect } from 'react';

export function usePageTitle(pageName: string) {
  useEffect(() => {
    document.title = `Purdue Mixed Media - ${pageName}`;
  }, [pageName]);
}
