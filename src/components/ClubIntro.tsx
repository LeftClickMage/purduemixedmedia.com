import { useEffect, useRef, useState } from 'react';
import Image from './Image';
import SubTitle from './Subtitle';
import { circularStarTrail } from '../assets/images';

const CLUB_MEMO = "Our mission is to bring creative minds together to create the next masterpiece.";
const CLUB_MEMO2 = "Whether that be an eye-catching photo or an award winning film, we'll bring your vision to fruition.";

function ClubIntro() {
  const [textVisible, setTextVisible] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [sectionAnimated, setSectionAnimated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
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
            {/* <SubTitle text={CLUB_MEMO2} className="text-white" /> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClubIntro;
