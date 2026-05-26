import { readSessionCookie, verifySession } from '../_lib/jwt';

interface Env {
  JWT_SECRET: string;
  DISCORD_TOKEN: string;
  GIGS_GUILD_ID: string;
  GIGS_VOICE_CHANNEL_ID?: string;
}

interface PostGigBody {
  description: string;
  location: string;
  startTime: string; // ISO
  endTime?: string; // ISO
  price: string;
  posterName: string;
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

  const { description, location, startTime, price, posterName } = body;
  if (!description || !location || !startTime || !price || !posterName) {
    return bad('Missing required fields');
  }

  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) return bad('Invalid startTime');
  if (start.getTime() < Date.now() + 60_000) return bad('Start time must be in the future');

  // Discord requires an end time for external events. Default to start + 2 hours.
  const end = body.endTime ? new Date(body.endTime) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  if (Number.isNaN(end.getTime()) || end <= start) return bad('Invalid endTime');

  const fullDescription = `${description}\n\nPosted by ${posterName} (Discord: ${session.username})`;

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

  const event = await res.json();
  return new Response(JSON.stringify({ ok: true, event }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
