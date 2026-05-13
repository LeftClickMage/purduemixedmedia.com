import { useRef, useState } from 'react';
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
  const [titleReady, setTitleReady] = useState(false);
  console.log('Title font:', titleFont.current.match(/'([^']+)'/)?.[1] ?? titleFont.current);

  return (
    <div>
      <style>{`
        .carousel-aspect { padding-bottom: 100%; }
        @media (min-width: 640px) { .carousel-aspect { padding-bottom: 66.66%; } }
        @media (min-width: 1024px) { .carousel-aspect { padding-bottom: 41.84%; } }
      `}</style>
      <div className="relative w-full carousel-aspect">
        <div className="absolute inset-0">
          <ImageCarousel
            images={carouselImages}
            interval={4000}
            onFirstLowResLoaded={() => setTitleReady(true)}
          />
          {titleReady && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Title text='Purdue Mixed Media' fontFamily={titleFont.current} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage;
