import { useRef, useState } from 'react';
import Title from '../components/Title';
import ImageCarousel from '../components/ImageCarousel';
import MovieQuotes from '../components/MovieQuotes';
import ClubIntro from '../components/ClubIntro';
import { hangout, camping, ethanTwuBTS, jonathanChanBTS, filmWorkshopBTS } from '../assets/images';
import { usePageTitle } from '../lib/usePageTitle';
import { usePageDescription } from '../lib/usePageDescription';
import { pageMeta } from '../lib/pageMeta';

const hangoutImage = { ...hangout, photographer: 'Ethan Twu' };
const otherImages = [
  { ...camping, photographer: 'Ethan Twu' },
  { ...ethanTwuBTS, photographer: 'Jonathan Chan' },
  { ...jonathanChanBTS, photographer: 'Ethan Twu' },
  { ...filmWorkshopBTS, photographer: 'Ethan Twu' },
];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const scriptFonts = [
  "'Pacifico', cursive",
  "'Dancing Script', cursive",
  "'Lobster', cursive",
  "'Sacramento', cursive",
  "'Caveat', cursive",
];

function pickRandomFont(): string {
  return scriptFonts[Math.floor(Math.random() * scriptFonts.length)];
}

function HomePage() {
  usePageTitle(pageMeta.home.title);
  usePageDescription(pageMeta.home.description);
  const titleFont = useRef(pickRandomFont());
  const carouselImages = useRef([hangoutImage, ...shuffle(otherImages)]);
  const [titleReady, setTitleReady] = useState(false);
  console.log('Title font:', titleFont.current.match(/'([^']+)'/)?.[1] ?? titleFont.current);

  return (
    <div>
      <div className="relative w-full carousel-aspect">
        <div className="absolute inset-0">
          <ImageCarousel
            images={carouselImages.current}
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
      <MovieQuotes />
      <ClubIntro />
    </div>
  )
}

export default HomePage;
