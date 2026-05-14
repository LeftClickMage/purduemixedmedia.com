import Subtitle from '../components/Subtitle';
import SocialCard from '../components/SocialCard';
import { usePageTitle } from '../lib/usePageTitle';
import { usePageDescription } from '../lib/usePageDescription';
import { pageMeta } from '../lib/pageMeta';

const SOCIALS = [
  {
    platform: 'Instagram',
    description: 'See Club BTS, event photos, and student projects.',
    href: 'https://instagram.com/purduemixedmedia',
    buttonText: 'Follow on Instagram',
  },
];

function MediaPage() {
  usePageTitle(pageMeta.media.title);
  usePageDescription(pageMeta.media.description);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
      <Subtitle text="Media" />
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {SOCIALS.map(s => (
          <li key={s.platform}>
            <SocialCard {...s} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MediaPage;
