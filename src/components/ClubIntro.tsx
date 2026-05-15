import { useEffect, useRef, useState } from 'react';
import Image from './Image';
import SubTitle from './Subtitle';
import FramedPhoto from './FramedPhoto';
import { circularStarTrail, bridgeButBTS, bridgeButBTS2, bridgePhotoET, ethanBTSDeanRK, deanRKBTS } from '../assets/images';

const CLUB_MEMO = "Our mission is to bring creative minds together to create the next masterpiece.";
const CLUB_MEMO2 = "Whether that be an eye-catching photo...";
const CLUB_MEMO3 = "Or an award winning film...";
const CLUB_MEMO4 = (
  <>We'll bring your <em>Vision</em> to <em>Fruition</em>.</>
);
function ClubIntro() {
  const [bridgeVisible, setBridgeVisible] = useState(false);
  const [bridgeProgress, setBridgeProgress] = useState(0); // 0..1 across the bridge section
  const bridgeRef = useRef<HTMLDivElement>(null);

  // Star-trail subtitle waits for the carousel reveal beat (~3.4s after mount, matching the old timing).
  const [textGateOpen, setTextGateOpen] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setTextGateOpen(true), 3400);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
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
  }, []);

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
      <FramedPhoto
        src={circularStarTrail.src}
        lowSrc={circularStarTrail.lowSrc}
        photographer="Vincent Romand-Heuyer"
        memo={CLUB_MEMO}
        memoGateOpen={textGateOpen}
        animateSection={false}
      />
      <div
        ref={bridgeRef}
        className="relative w-full"
        style={{ minHeight: '300vh' }}
      >
        {/* Blurred background — unblurs as you scroll through. */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Image
            src={bridgePhotoET.src}
            lowSrc={bridgePhotoET.lowSrc}
            alt=""
            photographer='Ethan Twu'
            className="absolute inset-0"
            imgStyle={{
              filter: `blur(${20 * (1 - Math.max(0, Math.min(1, (bridgeProgress - 0.3) / 0.4)))}px)`,
              transform: 'scale(1.05)',
            }}
          />
          {/* Dim layer so the overlay content stays readable while the bg is still blurred-busy. */}
          <div
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: 0.35 * (1 - Math.max(0, Math.min(1, (bridgeProgress - 0.3) / 0.4))) }}
          />
          {/* Memo2 in the background — mobile only. Unblurs slightly earlier than the photo. */}
          <div className="sm:hidden absolute inset-0 flex items-center justify-center text-center px-4 pt-32 pointer-events-none">
            <div
              style={{
                filter: `blur(${20 * (1 - Math.max(0, Math.min(1, (bridgeProgress - 0.2) / 0.4)))}px)`,
              }}
            >
              <SubTitle text={CLUB_MEMO2} className="text-white max-w-xs" />
            </div>
          </div>
        </div>
        {/* Scrolling overlay with the two BTS images + memo. Memo2 stays full opacity; BTS images fade out. */}
        <div
          className={`sticky top-0 h-screen w-full transition-opacity duration-[1200ms] ease-out ${bridgeVisible ? 'opacity-100' : 'opacity-0 translate-y-12'}`}
          style={{
            pointerEvents: bridgeProgress > 0.7 ? 'none' : undefined,
            marginTop: '-100vh',
          }}
        >
          <div className="max-w-6xl mx-auto mt-5 px-4 sm:px-8 h-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
            <div
              className="flex-1 w-full"
              style={{ opacity: 1 - Math.max(0, Math.min(1, (bridgeProgress - 0.3) / 0.4)) }}
            >
              <Image
                src={bridgeButBTS.src}
                lowSrc={bridgeButBTS.lowSrc}
                alt=""
                naturalHeight
                className="w-full rounded-lg"
              />
            </div>
            <div className="flex-1 flex flex-col gap-6 sm:gap-8 text-center sm:text-left">
              <div style={{ opacity: 1 - Math.max(0, Math.min(1, (bridgeProgress - 0.3) / 0.4)) }}>
                <Image
                  src={bridgeButBTS2.src}
                  lowSrc={bridgeButBTS2.lowSrc}
                  alt=""
                  naturalHeight
                  className="w-full rounded-lg"
                />
              </div>
              <SubTitle text={CLUB_MEMO2} className="hidden sm:block text-white" />
            </div>
          </div>
        </div>
      </div>
      <FramedPhoto
        src={ethanBTSDeanRK.src}
        lowSrc={ethanBTSDeanRK.lowSrc}
        memo={CLUB_MEMO3}
      />
      <FramedPhoto
        src={deanRKBTS.src}
        lowSrc={deanRKBTS.lowSrc}
        photographer="Jonathan Chan"
        memo={CLUB_MEMO4}
      />
    </section>
  );
}

export default ClubIntro;
