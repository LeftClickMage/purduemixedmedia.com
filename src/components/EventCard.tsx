import Image from './Image';
import Button from './Button';
import MiniTitle from './MiniTitle';
import Text from './Text';
import SubText from './SubText';
import EventDate from './EventDate';

export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
}

export interface DiscordEvent {
  id: string;
  guild_id?: string;
  name: string;
  description?: string;
  scheduled_start_time: string;
  scheduled_end_time?: string;
  entity_metadata?: { location?: string };
  image?: string;
  user_count?: number;
  creator?: DiscordUser;
  creator_id?: string;
  /** Discord scheduled event status: 1 = scheduled, 2 = active, 3 = completed, 4 = canceled */
  status?: number;
  recurrence_rule?: DiscordRecurrenceRule | null;
  guild_scheduled_event_exceptions?: DiscordEventException[];
}

interface DiscordRecurrenceRule {
  end?: string | null;
  /** 0 = yearly, 1 = monthly, 2 = weekly, 3 = daily */
  frequency: number;
  interval: number;
  /** 0 = Monday ... 6 = Sunday */
  by_weekday?: number[] | null;
}

interface DiscordEventException {
  /** Snowflake that encodes the original start time of the affected occurrence. */
  event_exception_id: string;
  is_canceled?: boolean;
}

const DISCORD_EVENT_STATUS_CANCELED = 4;
const DISCORD_EPOCH = 1420070400000;
const DAY_MS = 24 * 60 * 60 * 1000;

function snowflakeToMs(id: string): number {
  return Number(BigInt(id) >> 22n) + DISCORD_EPOCH;
}

/**
 * Hides events that are canceled. For recurring events whose upcoming occurrence
 * was canceled (a Discord "exception"), advances to the next non-canceled
 * occurrence instead. Returns null if nothing should be shown.
 */
export function resolveUpcomingOccurrence(event: DiscordEvent): DiscordEvent | null {
  if (event.status === DISCORD_EVENT_STATUS_CANCELED) return null;

  const canceledStarts = new Set(
    (event.guild_scheduled_event_exceptions ?? [])
      .filter(ex => ex.is_canceled)
      .map(ex => snowflakeToMs(ex.event_exception_id))
  );
  let start = new Date(event.scheduled_start_time).getTime();
  if (!canceledStarts.has(start)) return event;

  const rule = event.recurrence_rule;
  // Only daily/weekly recurrences can be stepped forward simply; hide anything else.
  if (!rule || (rule.frequency !== 2 && rule.frequency !== 3)) return null;

  const interval = Math.max(1, rule.interval || 1);
  const weekdays = rule.by_weekday?.length ? rule.by_weekday : null;
  // Step a day at a time when a weekday filter applies (e.g. "every weekday"),
  // otherwise jump by the full interval.
  const stepByDay = weekdays !== null && (rule.frequency === 3 || interval === 1);
  const step = stepByDay ? DAY_MS : (rule.frequency === 2 ? 7 : 1) * interval * DAY_MS;
  const ruleEnd = rule.end ? new Date(rule.end).getTime() : Infinity;
  const duration = event.scheduled_end_time
    ? new Date(event.scheduled_end_time).getTime() - start
    : null;

  for (let i = 0; i < 366; i++) {
    start += step;
    if (start > ruleEnd) return null;
    if (weekdays && stepByDay && !weekdays.includes((new Date(start).getUTCDay() + 6) % 7)) continue;
    if (canceledStarts.has(start)) continue;
    return {
      ...event,
      scheduled_start_time: new Date(start).toISOString(),
      scheduled_end_time: duration !== null ? new Date(start + duration).toISOString() : event.scheduled_end_time,
    };
  }
  return null;
}

interface EventCardProps {
  event: DiscordEvent;
}

function EventCard({ event }: EventCardProps) {
  const discordUrl = event.guild_id ? `https://discord.com/events/${event.guild_id}/${event.id}` : null;
  const imageBaseUrl = event.image ? `https://cdn.discordapp.com/guild-events/${event.id}/${event.image}.png` : null;

  return (
    <li className="silver-glint border border-black rounded-lg p-4 sm:p-6 flex flex-col gap-2">
      <div className="relative w-full h-40 sm:h-48 mb-2 rounded-md overflow-hidden">
        <Image
          lowSrc={imageBaseUrl ? `${imageBaseUrl}?size=32` : undefined}
          src={imageBaseUrl ? `${imageBaseUrl}?size=2048` : undefined}
          alt={event.name}
          className="w-full h-full"
        />
        {event.entity_metadata?.location && (
          <div className="absolute bottom-2 left-2 z-10 text-white text-xs px-2 py-1 bg-black/60 rounded">
            📍 {event.entity_metadata.location}
          </div>
        )}
      </div>
      {/* Title row: title left, interested count right (desktop only — count moves to date row on mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <MiniTitle text={event.name} />
        {event.user_count !== undefined && (
          <SubText text={`🙋 ${event.user_count} interested`} className="hidden sm:block shrink-0" />
        )}
      </div>
      {event.description && (
        <Text text={event.description} />
      )}
      {/* Date row: date left; on mobile shows interested count on right, on desktop shows the View on Discord button on right */}
      <div className="flex items-center justify-between gap-2">
        <EventDate startTime={event.scheduled_start_time} endTime={event.scheduled_end_time} />
        {/* Mobile only */}
        {event.user_count !== undefined && (
          <SubText text={`🙋 ${event.user_count} interested`} className="sm:hidden shrink-0" />
        )}
        {/* Desktop only */}
        {discordUrl && (
          <Button
            text="View on Discord"
            href={discordUrl}
            target="_blank"
            className="hidden sm:inline-block shrink-0"
          />
        )}
      </div>
      {/* Mobile only: full-width View on Discord button at the bottom */}
      {discordUrl && (
        <Button
          text="View on Discord"
          href={discordUrl}
          target="_blank"
          className="sm:hidden block w-full text-center mt-2"
        />
      )}
    </li>
  );
}

export default EventCard;
