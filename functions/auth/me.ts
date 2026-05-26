import { readSessionCookie, verifySession } from '../_lib/jwt';

interface Env {
  JWT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const token = readSessionCookie(request);
  const session = token ? await verifySession(token, env.JWT_SECRET) : null;
  return new Response(JSON.stringify(session ?? null), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
