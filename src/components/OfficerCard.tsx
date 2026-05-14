import { useEffect, useRef, useState } from 'react';
import Image from './Image';
import MiniTitle from './MiniTitle';
import Button from './Button';

export interface Officer {
  name: string;
  role?: string;
  description: string;
  photo?: string;
  portfolio?: string;
  contact?: string;
}

interface OfficerCardProps {
  officer: Officer;
}

type Phase = 'collapsed' | 'expanding' | 'expanded' | 'collapsing';
const COLLAPSED_HEIGHT = '4.5rem'; // ~3 lines of text-base

function OfficerCard({ officer }: OfficerCardProps) {
  const [phase, setPhase] = useState<Phase>('collapsed');
  const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  // Detect whether the collapsed description is overflowing (so we know whether to make it clickable).
  useEffect(() => {
    if (phase !== 'collapsed') return;
    const el = descRef.current;
    if (!el) return;
    const check = () => setIsClamped(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [officer.description, phase]);

  const handleToggle = () => {
    const el = descRef.current;
    if (!el) return;
    if (phase === 'collapsed') {
      if (!isClamped) return;
      const target = el.scrollHeight;
      setMaxHeight(`${el.clientHeight}px`); // anchor from current clamped height
      setPhase('expanding');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setMaxHeight(`${target}px`));
      });
    } else if (phase === 'expanded') {
      const current = el.scrollHeight;
      setMaxHeight(`${current}px`); // anchor from full height
      setPhase('collapsing');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setMaxHeight(COLLAPSED_HEIGHT));
      });
    }
  };

  const handleTransitionEnd = () => {
    if (phase === 'expanding') {
      setPhase('expanded');
      setMaxHeight(undefined); // release the cap so resize works normally
    } else if (phase === 'collapsing') {
      setPhase('collapsed');
      setMaxHeight(undefined); // line-clamp takes over again
    }
  };

  const isInteractive = isClamped || phase !== 'collapsed';
  const showLineClamp = phase === 'collapsed';

  return (
    <li className="silver-glint border border-black rounded-lg p-4 sm:p-6 flex flex-col gap-2">
      <div className="relative aspect-square mb-2 rounded-md overflow-hidden">
        <Image src={officer.photo} alt={officer.name} className="w-full h-full" />
        {officer.role && (
          <div className="absolute top-0 left-0 right-0 z-10 text-white text-base sm:text-lg font-medium text-center px-2 py-2 bg-black/60">
            {officer.role.split(/(webmaster)/i).map((part, i) =>
              /^webmaster$/i.test(part)
                ? <span key={i} className="text-sky-300">{part}</span>
                : <span key={i}>{part}</span>
            )}
          </div>
        )}
      </div>
      <MiniTitle text={officer.name} />
      <p
        ref={descRef}
        onClick={handleToggle}
        onTransitionEnd={handleTransitionEnd}
        className={`text-gray-700 flex-1 overflow-hidden transition-[max-height] duration-300 ease-in-out ${showLineClamp ? 'line-clamp-3' : ''} ${isInteractive ? 'cursor-pointer' : ''}`}
        style={{ maxHeight }}
      >
        {officer.description}
      </p>
      {(officer.portfolio || officer.contact) && (
        <div className="flex gap-2 mt-2">
          {officer.portfolio && (
            <Button
              text="View Portfolio"
              href={officer.portfolio}
              target="_blank"
              className="flex-1 text-center"
            />
          )}
          {officer.contact && (
            <Button
              text="Contact"
              href={`mailto:${officer.contact}`}
              className="flex-1 text-center"
            />
          )}
        </div>
      )}
    </li>
  );
}

export default OfficerCard;
