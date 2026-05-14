import Subtitle from '../components/Subtitle';
import { usePageTitle } from '../lib/usePageTitle';
import { usePageDescription } from '../lib/usePageDescription';
import { pageMeta } from '../lib/pageMeta';

function MediaPage() {
  usePageTitle(pageMeta.media.title);
  usePageDescription(pageMeta.media.description);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <Subtitle text="Media" />
      <p className="text-gray-500">Coming soon.</p>
    </div>
  );
}

export default MediaPage;
