interface Env {
  DISCORD_CLIENT_ID: string;
  DISCORD_REDIRECT_URI: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') ?? '/gigs';
  const state = btoa(JSON.stringify({ returnTo, n: crypto.randomUUID() }))
    .replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

  const authorize = new URL('https://discord.com/oauth2/authorize');
  authorize.searchParams.set('client_id', env.DISCORD_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', env.DISCORD_REDIRECT_URI);
  authorize.searchParams.set('response_type', 'code');
  authorize.searchParams.set('scope', 'identify guilds.members.read');
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('prompt', 'none');

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `pmm_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
    },
  });
};
