import Button from '../components/Button';
import Title from '../components/Title';
import ImageCarousel from '../components/ImageCarousel';
import PurdueMixedMediaClubHangout from '../assets/PurdueMixedMediaClubHangout.JPG';
import PurdueMixedMediaClubCamping from '../assets/PurdueMixedMediaClubCamping.jpg';

const carouselImages = [
  { src: PurdueMixedMediaClubHangout, photographer: 'Ethan Twu' },
  { src: PurdueMixedMediaClubCamping, photographer: 'Ethan Twu' },
];

function HomePage() {
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