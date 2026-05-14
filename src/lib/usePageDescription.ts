import { useEffect } from 'react';

export function usePageDescription(description: string) {
  useEffect(() => {
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
  }, [description]);
}
