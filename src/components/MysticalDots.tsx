import { useMemo } from 'react';

interface DotSpec {
  top: number;        // percent
  left: number;       // percent
  size: number;       // px
  pulseDur: number;
  pulseDelay: number;
  driftXDur: number;
  driftXDelay: number;
  driftXAmp: number;  // px
  driftYDur: number;
  driftYDelay: number;
  driftYAmp: number;  // px
}

interface MysticalDotsProps {
  count?: number;
  className?: string;
}

function makeDots(count: number): DotSpec[] {
  return Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 3 + Math.random() * 5,             // 3–8px
    pulseDur: 4 + Math.random() * 4,         // 4–8s
    pulseDelay: -Math.random() * 8,
    driftXDur: 8 + Math.random() * 6,        // 8–14s
    driftXDelay: -Math.random() * 14,
    driftXAmp: 6 + Math.random() * 10,       // 6–16px
    driftYDur: 9 + Math.random() * 6,        // 9–15s
    driftYDelay: -Math.random() * 15,
    driftYAmp: 6 + Math.random() * 10,
  }));
}

function MysticalDots({ count = 25, className }: MysticalDotsProps) {
  const dots = useMemo(() => makeDots(count), [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden>
      <style>{`
        @keyframes md-pulse {
          0%, 100% { opacity: 0; }
          50%      { opacity: 0.55; }
        }
        @keyframes md-drift-x {
          0%   { transform: translate3d(var(--ax), 0, 0); }
          50%  { transform: translate3d(calc(var(--ax) * -1), 0, 0); }
          100% { transform: translate3d(var(--ax), 0, 0); }
        }
        @keyframes md-drift-y {
          0%   { transform: translate3d(0, var(--ay), 0); }
          50%  { transform: translate3d(0, calc(var(--ay) * -1), 0); }
          100% { transform: translate3d(0, var(--ay), 0); }
        }
      `}</style>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            ['--ax' as string]: `${d.driftXAmp}px`,
            animation: `md-drift-x ${d.driftXDur}s ease-in-out ${d.driftXDelay}s infinite`,
          }}
        >
          <span
            className="block"
            style={{
              ['--ay' as string]: `${d.driftYAmp}px`,
              animation: `md-drift-y ${d.driftYDur}s ease-in-out ${d.driftYDelay}s infinite`,
            }}
          >
            <span
              className="block rounded-full bg-black"
              style={{
                width: `${d.size}px`,
                height: `${d.size}px`,
                boxShadow: `0 0 ${d.size * 1.5}px ${d.size * 0.4}px rgba(0,0,0,0.35)`,
                animation: `md-pulse ${d.pulseDur}s ease-in-out ${d.pulseDelay}s infinite`,
              }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}

export default MysticalDots;
