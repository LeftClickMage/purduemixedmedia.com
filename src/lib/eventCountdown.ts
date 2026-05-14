export type CountdownStatus = 'far' | 'soon' | 'in-progress' | 'ended';

export interface CountdownInfo {
  text: string;
  status: CountdownStatus;
}

export function getCountdown(startIso: string, endIso: string | undefined, now: number): CountdownInfo {
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : null;

  if (end !== null && now > end) return { text: 'Ended', status: 'ended' };
  if (now >= start) {
    if (end === null) return { text: 'Ended', status: 'ended' };
    return { text: 'In progress', status: 'in-progress' };
  }

  const diffMs = start - now;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  const isSoon = diffHr < 1;
  const status: CountdownStatus = isSoon ? 'soon' : 'far';

  if (diffMin < 5) return { text: 'Starting now', status };
  if (diffHr < 1) return { text: `in ${diffMin}m`, status };
  if (diffDay < 1) return { text: `in ${diffHr}h ${diffMin % 60}m`, status };
  return { text: `in ${diffDay}d ${diffHr % 24}h`, status };
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
