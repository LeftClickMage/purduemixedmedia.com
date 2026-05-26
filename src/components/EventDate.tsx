import { useEffect, useState } from 'react';
import { formatShortDate, getCountdown } from '../lib/eventCountdown';

interface EventDateProps {
  startTime: string;
  endTime?: string;
  className?: string;
}

function EventDate({ startTime, endTime, className }: EventDateProps) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const shortDate = formatShortDate(startTime);
  const countdown = getCountdown(startTime, endTime, now);
  const isUrgent = countdown.status === 'soon' || countdown.status === 'in-progress';

  return (
    <p className={`text-sm text-gray-500 ${className ?? ''}`}>
      {shortDate} · <span className={isUrgent ? 'text-gold-700 font-medium' : ''}>{countdown.text}</span>
    </p>
  );
}

export default EventDate;
