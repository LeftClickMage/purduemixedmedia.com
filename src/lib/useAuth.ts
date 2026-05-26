import { useEffect, useState } from 'react';

export interface Session {
  id: string;
  username: string;
  avatar: string | null;
  member: boolean;
  exp: number;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (import.meta.env.DEV && location.hostname === 'localhost') {
      setSession({
        id: 'dev',
        username: 'dev',
        avatar: null,
        member: true,
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      setLoading(false);
      return;
    }
    fetch('/auth/me', { credentials: 'same-origin' })
      .then(r => r.json())
      .then((data: Session | null) => setSession(data))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  return { session, loading };
}
