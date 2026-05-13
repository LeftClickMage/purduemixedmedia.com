import Button from '../components/Button';
import Title from '../components/Title';
import ImageCarousel from '../components/ImageCarousel';
import { hangout, camping } from '../assets/images';
import { usePageTitle } from '../lib/usePageTitle';

const carouselImages = [
  { ...hangout, photographer: 'Ethan Twu' },
  { ...camping, photographer: 'Ethan Twu' },
];

function HomePage() {
  usePageTitle('Home');
  return (
    <div>
      <div className="relative w-full" style={{ aspectRatio: '2.39 / 1' }}>
        <ImageCarousel images={carouselImages} interval={4000} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Title text='Purdue Mixed Media' />
        </div>
      </div>
    </div>
  )
}

export default HomePage;
