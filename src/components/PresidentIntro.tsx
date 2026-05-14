import { useEffect, useState } from 'react';
import Image from './Image';
import MiniTitle from './MiniTitle';
import SubText from './SubText';
import Text from './Text';
import { ethanWorkingOnSteadicam } from '../assets/images';
import { fetchSheet } from '../lib/sheets';

interface President {
  name: string;
  role: string;
  photo?: string;
}

const CLUB_MEMO = "Our mission is to bring creative minds together to create the next masterpiece. Whether that be an eye-catching photo or an award winning film, we'll bring your vision to fruition.";

function PresidentIntro() {
  const [president, setPresident] = useState<President | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 2300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    fetchSheet(import.meta.env.VITE_OFFICERS_SHEET_ID, 'A:F')
      .then(rows => {
        const match = rows.find(r => /president/i.test(r['Role'] ?? ''));
        if (match) {
          setPresident({
            name: match['Name'],
            role: match['Role'],
            photo: match['Headshot'] || undefined,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      className={`max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 transition-all duration-[800ms] ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
        <Image
          src={ethanWorkingOnSteadicam.src}
          lowSrc={ethanWorkingOnSteadicam.lowSrc}
          alt={president?.name ?? ''}
          naturalHeight
          className="flex-1 w-full rounded-md border border-black"
        />
        <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
          {president && <MiniTitle text={president.name} />}
          {president && <SubText text={president.role} />}
          <Text text={CLUB_MEMO} />
        </div>
      </div>
    </section>
  );
}

export default PresidentIntro;
