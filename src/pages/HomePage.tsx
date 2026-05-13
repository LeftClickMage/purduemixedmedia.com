import { useRef } from 'react';
import Title from '../components/Title';
import ImageCarousel from '../components/ImageCarousel';
import { hangout, camping } from '../assets/images';
import { usePageTitle } from '../lib/usePageTitle';

const carouselImages = [
  { ...hangout, photographer: 'Ethan Twu' },
  { ...camping, photographer: 'Ethan Twu' },
];

const scriptFonts = [
  "'Pacifico', cursive",
  "'Dancing Script', cursive",
  "'Great Vibes', cursive",
  "'Lobster', cursive",
  "'Sacramento', cursive",
  "'Caveat', cursive",
];

function pickRandomFont(): string {
  return scriptFonts[Math.floor(Math.random() * scriptFonts.length)];
}

function HomePage() {
  usePageTitle('Home');
  const titleFont = useRef(pickRandomFont());
  console.log('Title font:', titleFont.current.match(/'([^']+)'/)?.[1] ?? titleFont.current);

  return (
    <div>
      <div className="relative w-full" style={{ paddingBottom: '41.84%' }}>
        <div className="absolute inset-0">
          <ImageCarousel images={carouselImages} interval={4000} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Title text='Purdue Mixed Media' fontFamily={titleFont.current} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;
