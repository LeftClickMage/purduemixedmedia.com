import { readSessionCookie, verifySession } from '../_lib/jwt';

interface Env {
  JWT_SECRET: string;
  DISCORD_TOKEN: string;
  GIGS_GUILD_ID: string;
  GIGS_VOICE_CHANNEL_ID?: string;
  GIGS_WORKER_URL?: string;
  CACHE_BUST_SECRET?: string;
  GIGS_NOTIFY_CHANNEL_ID?: string;
}

interface PostGigBody {
  description: string;
  location: string;
  startTime: string; // ISO
  endTime?: string; // ISO
  price: string;
  posterName: string;
  email: string;
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

  let body: PostGigBody;
  try {
    body = await request.json();
  } catch {
    return bad('Invalid JSON');
  }

  const { description, location, startTime, price, posterName, email } = body;
  if (!description || !location || !startTime || !price || !posterName || !email) {
    return bad('Missing required fields');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return bad('Invalid email address');
  }

  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) return bad('Invalid startTime');
  if (start.getTime() < Date.now() + 60_000) return bad('Start time must be in the future');

  // Discord requires an end time for external events. Default to start + 2 hours.
  const end = body.endTime ? new Date(body.endTime) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  if (Number.isNaN(end.getTime()) || end <= start) return bad('Invalid endTime');

  const gigId = Math.floor(100000 + Math.random() * 900000).toString();
  const fullDescription = `${description}\n\nPosted by ${posterName}\nEmail: ${email}\nDiscord Username: ${session.username}\nGig ID: ${gigId}`;

  const payload = {
    name: price,
    description: fullDescription.slice(0, 1000),
    scheduled_start_time: start.toISOString(),
    scheduled_end_time: end.toISOString(),
    entity_type: 3, // EXTERNAL
    entity_metadata: { location: location.slice(0, 100) },
    privacy_level: 2, // GUILD_ONLY
  };

  const res = await fetch(
    `https://discord.com/api/v10/guilds/${env.GIGS_GUILD_ID}/scheduled-events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bot ${env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ message: 'Discord rejected the event', detail: text }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const event = await res.json<{ id: string }>();

  // Bust the worker's cache so the new gig shows up immediately on /gigs.
  // Best-effort: failures here don't fail the post.
  if (env.GIGS_WORKER_URL && env.CACHE_BUST_SECRET) {
    try {
      await fetch(`${env.GIGS_WORKER_URL.replace(/\/$/, '')}/bust?type=gigs`, {
        method: 'POST',
        headers: { 'X-Cache-Bust-Secret': env.CACHE_BUST_SECRET },
      });
    } catch {
      // ignore
    }
  }

  // Notify the gigs channel. Best-effort.
  if (env.GIGS_NOTIFY_CHANNEL_ID) {
    const eventUrl = `https://discord.com/events/${env.GIGS_GUILD_ID}/${event.id}`;
    try {
      await fetch(`https://discord.com/api/v10/channels/${env.GIGS_NOTIFY_CHANNEL_ID}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${env.DISCORD_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `📣 **New gig posted: ${price}**\nLocation: ${location}\nPosted by ${posterName}\nGig ID: ${gigId}\n${eventUrl}`,
          allowed_mentions: { parse: [] },
        }),
      });
    } catch {
      // ignore
    }
  }

  return new Response(JSON.stringify({ ok: true, event }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
