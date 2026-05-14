import { useEffect, useRef, useState } from 'react';
import Image from './Image';
import SubTitle from './Subtitle';
import { circularStarTrail, bridgeButBTS, bridgeButBTS2, bridgePhotoET } from '../assets/images';

const CLUB_MEMO = "Our mission is to bring creative minds together to create the next masterpiece.";
const CLUB_MEMO2 = "Whether that be an eye-catching photo...";
const CLUB_MEMO3 = "Or an award winning film, we'll bring your vision to fruition.";
function ClubIntro() {
  const [textVisible, setTextVisible] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [sectionAnimated, setSectionAnimated] = useState(false);
  const [bridgeVisible, setBridgeVisible] = useState(false);
  const [bridgeProgress, setBridgeProgress] = useState(0); // 0..1 across the bridge section
  const textRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const showId = setTimeout(() => setSectionVisible(true), 2200);
    const animatedId = setTimeout(() => setSectionAnimated(true), 2200 + 1200);
    return () => {
      clearTimeout(showId);
      clearTimeout(animatedId);
    };
  }, []);

  useEffect(() => {
    if (!sectionAnimated) return;
    const el = textRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTextVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionAnimated]);

  useEffect(() => {
    if (!sectionVisible) return;
    const el = bridgeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setBridgeVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionVisible]);

  useEffect(() => {
    const el = bridgeRef.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Progress goes 0 when the section's top touches the bottom of the viewport,
      // to 1 when the section's bottom reaches the top of the viewport.
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      setBridgeProgress(p);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative w-full bg-black">
      <div
        className={`relative w-full transition-all duration-[1200ms] ease-out ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="relative w-full club-intro-aspect border-y-5 border-black">
          <Image
            src={circularStarTrail.src}
            lowSrc={circularStarTrail.lowSrc}
            alt=""
            photographer="Vincent Romand-Heuyer"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 text-white pointer-events-none">
            <div
              ref={textRef}
              className={`flex flex-col items-center gap-2 sm:gap-4 transition-all duration-[800ms] ease-out ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            >
              <SubTitle text={CLUB_MEMO} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      <div
        ref={bridgeRef}
        className="relative w-full"
        style={{ minHeight: '150vh' }}
      >
        {/* Blurred background — unblurs as you scroll through. */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img
            src={bridgePhotoET.src}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              // Stay fully blurred until the section is centered/pinned (~0.4), then unblur by ~0.6.
              filter: `blur(${20 * (1 - Math.max(0, Math.min(1, (bridgeProgress - 0.4) / 0.2)))}px)`,
              transform: 'scale(1.05)',
            }}
          />
          {/* Dim layer so the overlay content stays readable while the bg is still blurred-busy. */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.35 * (1 - Math.max(0, Math.min(1, (bridgeProgress - 0.4) / 0.2))) }}
          />
        </div>
        {/* Scrolling overlay with the two BTS images + memo. Memo2 stays full opacity; BTS images fade out. */}
        <div
          className={`sticky top-0 h-screen w-full transition-opacity duration-[1200ms] ease-out ${bridgeVisible ? 'opacity-100' : 'opacity-0 translate-y-12'}`}
          style={{
            pointerEvents: bridgeProgress > 0.5 ? 'none' : undefined,
            marginTop: '-100vh',
          }}
        >
          <div className="max-w-6xl mx-auto mt-5 px-4 sm:px-8 h-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
            <div
              className="flex-1 w-full"
              style={{ opacity: 1 - Math.max(0, Math.min(1, (bridgeProgress - 0.4) / 0.2)) }}
            >
              <Image
                src={bridgeButBTS.src}
                lowSrc={bridgeButBTS.lowSrc}
                alt=""
                naturalHeight
                className="w-full rounded-md"
              />
            </div>
            <div className="flex-1 flex flex-col gap-6 sm:gap-8 text-center sm:text-left">
              <div style={{ opacity: 1 - Math.max(0, Math.min(1, (bridgeProgress - 0.4) / 0.2)) }}>
                <Image
                  src={bridgeButBTS2.src}
                  lowSrc={bridgeButBTS2.lowSrc}
                  alt=""
                  naturalHeight
                  className="w-full rounded-md"
                />
              </div>
              <SubTitle text={CLUB_MEMO2} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClubIntro;
