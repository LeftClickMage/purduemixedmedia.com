import { signSession, sessionCookie } from '../_lib/jwt';

interface Env {
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_REDIRECT_URI: string;
  GIGS_GUILD_ID: string;
  JWT_SECRET: string;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function readCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  for (const part of cookie.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

function decodeState(state: string): { returnTo: string } | null {
  try {
    const pad = state.length % 4 === 0 ? '' : '='.repeat(4 - (state.length % 4));
    const json = atob(state.replace(/-/g, '+').replace(/_/g, '/') + pad);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = readCookie(request, 'pmm_oauth_state');

  if (!code || !state || state !== storedState) {
    return new Response('Invalid OAuth state', { status: 400 });
  }

  const returnTo = decodeState(state)?.returnTo ?? '/gigs';

  // Exchange code for access token
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.DISCORD_REDIRECT_URI,
    }),
  });
  if (!tokenRes.ok) return new Response('Token exchange failed', { status: 401 });
  const tokenData = await tokenRes.json<{ access_token: string }>();

  // Identify user
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!userRes.ok) return new Response('Identify failed', { status: 401 });
  const user = await userRes.json<{ id: string; username: string; avatar: string | null }>();

  // Check guild membership via guilds.members.read (returns 200 if the user is a member)
  const memberRes = await fetch(
    `https://discord.com/api/users/@me/guilds/${env.GIGS_GUILD_ID}/member`,
    { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
  );
  const member = memberRes.ok;

  const token = await signSession(
    {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      member,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    },
    env.JWT_SECRET
  );

  const safeReturn = returnTo.startsWith('/') ? returnTo : '/gigs';
  const headers = new Headers({ Location: safeReturn });
  headers.append('Set-Cookie', sessionCookie(token, SESSION_TTL_SECONDS));
  headers.append('Set-Cookie', 'pmm_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');
  return new Response(null, { status: 302, headers });
};
