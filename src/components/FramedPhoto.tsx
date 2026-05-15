import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from './Image';
import SubTitle from './Subtitle';

interface FramedPhotoProps {
  src: string;
  lowSrc?: string;
  alt?: string;
  photographer?: string;
  /** Optional centered text overlaid on the photo. */
  memo?: ReactNode;
  /** If provided, the memo's scroll observer only attaches after this becomes true. */
  memoGateOpen?: boolean;
  /** When true (default), the entire frame fades up when scrolled into view. */
  animateSection?: boolean;
  className?: string;
}

function FramedPhoto({
  src,
  lowSrc,
  alt = '',
  photographer,
  memo,
  memoGateOpen = true,
  animateSection = true,
  className,
}: FramedPhotoProps) {
  const [sectionVisible, setSectionVisible] = useState(!animateSection);
  const [memoVisible, setMemoVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const memoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animateSection) return;
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSectionVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animateSection]);

  useEffect(() => {
    if (!memo || !memoGateOpen) return;
    const el = memoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMemoVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [memo, memoGateOpen]);

  const sectionClasses = animateSection
    ? `transition-all duration-[1200ms] ease-out ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`
    : '';

  return (
    <div
      ref={sectionRef}
      className={`relative w-full club-intro-aspect border-y-5 border-black ${sectionClasses} ${className ?? ''}`}
    >
      <Image
        src={src}
        lowSrc={lowSrc}
        alt={alt}
        photographer={photographer}
        className="absolute inset-0"
      />
      {memo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 text-white pointer-events-none">
          <div
            ref={memoRef}
            className={`flex flex-col items-center gap-2 sm:gap-4 transition-all duration-[800ms] ease-out ${memoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            <SubTitle text={memo} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

export default FramedPhoto;
