import { readSessionCookie, verifySession } from '../_lib/jwt';

interface Env {
  JWT_SECRET: string;
  DISCORD_TOKEN: string;
  GIGS_GUILD_ID: string;
  GIGS_WORKER_URL?: string;
  CACHE_BUST_SECRET?: string;
  GIGS_NOTIFY_CHANNEL_ID?: string;
}

function bad(message: string, status = 400): Response {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const token = readSessionCookie(request);
  const session = token ? await verifySession(token, env.JWT_SECRET) : null;
  if (!session) return bad('Not logged in', 401);

  let body: { eventId?: string };
  try {
    body = await request.json();
  } catch {
    return bad('Invalid JSON');
  }

  const eventId = body.eventId;
  if (!eventId || !/^[0-9]+$/.test(eventId)) return bad('Invalid eventId');

  // Verify the caller owns this gig by reading the event and checking the footer.
  const getRes = await fetch(
    `https://discord.com/api/v10/guilds/${env.GIGS_GUILD_ID}/scheduled-events/${eventId}`,
    { headers: { Authorization: `Bot ${env.DISCORD_TOKEN}` } }
  );
  if (!getRes.ok) {
    const text = await getRes.text();
    return new Response(JSON.stringify({ message: 'Could not load event', detail: text }), {
      status: getRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const event = await getRes.json<{ description?: string; name?: string; entity_metadata?: { location?: string } }>();
  const expected = `Discord Username: ${session.username}`;
  if (!event.description || !event.description.includes(expected)) {
    return bad('You do not own this gig', 403);
  }

  const delRes = await fetch(
    `https://discord.com/api/v10/guilds/${env.GIGS_GUILD_ID}/scheduled-events/${eventId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bot ${env.DISCORD_TOKEN}` },
    }
  );
  if (!delRes.ok && delRes.status !== 204) {
    const text = await delRes.text();
    return new Response(JSON.stringify({ message: 'Discord rejected delete', detail: text }), {
      status: delRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (env.GIGS_WORKER_URL && env.CACHE_BUST_SECRET) {
    // Wait a few seconds so Discord's list endpoint stops returning the deleted event
    // before we clear the worker's cache.
    await new Promise(resolve => setTimeout(resolve, 3000));
    try {
      await fetch(`${env.GIGS_WORKER_URL.replace(/\/$/, '')}/bust?type=gigs`, {
        method: 'POST',
        headers: { 'X-Cache-Bust-Secret': env.CACHE_BUST_SECRET },
      });
    } catch {
      // ignore
    }
  }

  if (env.GIGS_NOTIFY_CHANNEL_ID) {
    const locationLine = event.entity_metadata?.location ? `\nLocation: ${event.entity_metadata.location}` : '';
    const idMatch = event.description?.match(/Gig ID:\s*([0-9]+)/);
    const idLine = idMatch ? `\nGig ID: ${idMatch[1]}` : '';
    try {
      await fetch(`https://discord.com/api/v10/channels/${env.GIGS_NOTIFY_CHANNEL_ID}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${env.DISCORD_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `❌ **Gig cancelled: ${event.name ?? 'Untitled'}**${locationLine}${idLine}\nCancelled by ${session.username}`,
          allowed_mentions: { parse: [] },
        }),
      });
    } catch {
      // ignore
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
