import { useMemo, useRef } from 'react';

const movieQuotes = [
  { quote: 'You either die a hero or you live long enough to see yourself become the villain.', movie: 'The Dark Knight' },
  { quote: "I'm gonna make him an offer he can't refuse.", movie: 'The Godfather' },
  { quote: 'May the Force be with you.', movie: 'Star Wars' },
  { quote: 'Life is like a box of chocolates. You never know what you’re gonna get.', movie: 'Forrest Gump' },
  { quote: "Here's looking at you, kid.", movie: 'Casablanca' },
  { quote: "I'll be back.", movie: 'The Terminator' },
  { quote: "Houston, we have a problem.", movie: 'Apollo 13' },
  { quote: "To infinity and beyond!", movie: 'Toy Story' },
  { quote: "Just keep swimming.", movie: 'Finding Nemo' },
  { quote: "My precious.", movie: 'The Lord of the Rings' },
  { quote: "Hasta la vista, baby.", movie: 'Terminator 2' },
  { quote: "There's no place like home.", movie: 'The Wizard of Oz' },
  { quote: "Do not go gentle into that good night.", movie: 'Interstellar' },
  { quote: "Love is the one thing we're capable of perceiving that transcends dimensions of time and space.", movie: 'Interstellar' },
  { quote: "Question! — Question!", movie: 'Project Hail Mary' },
  { quote: "Fist my bump.", movie: 'Project Hail Mary' },
];

function pickRandomQuote() {
  return movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
}

interface DriftParams {
  durX: number;  // seconds for full x cycle
  durY: number;  // seconds for full y cycle
  phaseX: number; // 0..1 starting position in x cycle
  phaseY: number;
  ampX: number;  // pixels
  ampY: number;
}

function randomDrift(): DriftParams {
  return {
    durX: 6 + Math.random() * 4,   // 6–10s
    durY: 7 + Math.random() * 4,   // 7–11s
    phaseX: Math.random(),
    phaseY: Math.random(),
    ampX: 1 + Math.random() * 0.5,   // 1 - 1.5px
    ampY: 1 + Math.random() * 0.5,   // 1 - 1.5px
  };
}

interface DriftingProps {
  word: string;
  drift: DriftParams;
  introDelay: number; // seconds before this word starts the intro animation
  className?: string;
}

const INTRO_DURATION = 0.9; // seconds per word

function Drifting({ word, drift, introDelay, className }: DriftingProps) {
  return (
    <span
      className={`mq-intro ${className ?? ''}`}
      style={{
        animation: `mq-intro ${INTRO_DURATION}s ease-out ${introDelay}s both`,
      }}
    >
      <span
        className="mq-word"
        style={{
          ['--ax' as string]: `${drift.ampX}px`,
          animation: `mq-drift-x ${drift.durX}s ease-in-out ${-drift.phaseX * drift.durX}s infinite`,
        }}
      >
        <span
          style={{
            ['--ay' as string]: `${drift.ampY}px`,
            animation: `mq-drift-y ${drift.durY}s ease-in-out ${-drift.phaseY * drift.durY}s infinite`,
          }}
        >
          {word}
        </span>
      </span>
    </span>
  );
}

function MovieQuotes() {
  const quote = useRef(pickRandomQuote());
  const quoteText = `“${quote.current.quote}”`;
  const creditText = `— ${quote.current.movie}`;
  const quoteWords = useMemo(() => quoteText.split(/(\s+)/), [quoteText]);
  const creditWords = useMemo(() => creditText.split(/(\s+)/), [creditText]);
  const quoteDrifts = useMemo(() => quoteWords.map(() => randomDrift()), [quoteWords]);
  const creditDrifts = useMemo(() => creditWords.map(() => randomDrift()), [creditWords]);

  // Spread the intro across the visible words (skip whitespace tokens) so the total animation lasts ~2s.
  const totalVisible = [...quoteWords, ...creditWords].filter(w => !/^\s+$/.test(w)).length;
  const introSpread = 2; // total seconds from first word starting to last word starting
  const stepDelay = totalVisible > 1 ? introSpread / (totalVisible - 1) : 0;
  let visibleIndex = -1;

  return (
    <>
      <style>{`
        @keyframes mq-drift-x { 0% { transform: translate3d(var(--ax), 0, 0); } 50% { transform: translate3d(calc(var(--ax) * -1), 0, 0); } 100% { transform: translate3d(var(--ax), 0, 0); } }
        @keyframes mq-drift-y { 0% { transform: translate3d(0, var(--ay), 0); } 50% { transform: translate3d(0, calc(var(--ay) * -1), 0); } 100% { transform: translate3d(0, var(--ay), 0); } }
        @keyframes mq-intro { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
        .mq-word { display: inline-block; will-change: transform; }
        .mq-word > span { display: inline-block; will-change: transform; }
        .mq-intro { display: inline-block; will-change: transform, opacity; }
      `}</style>
      <p
        className="text-center text-2xl sm:text-3xl md:text-4xl text-gray-800 px-4 sm:px-8 py-8 sm:py-12 italic"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        {quoteWords.map((word, i) => {
          if (/^\s+$/.test(word)) return word;
          visibleIndex++;
          return <Drifting key={i} word={word} drift={quoteDrifts[i]} introDelay={visibleIndex * stepDelay} />;
        })}
        {' '}
        <span className="whitespace-nowrap">
          {creditWords.map((word, i) => {
            if (/^\s+$/.test(word)) return word;
            visibleIndex++;
            return <Drifting key={i} word={word} drift={creditDrifts[i]} introDelay={visibleIndex * stepDelay} />;
          })}
        </span>
      </p>
    </>
  );
}

export default MovieQuotes;
