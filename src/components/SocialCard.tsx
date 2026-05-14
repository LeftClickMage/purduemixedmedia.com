import type { ReactNode } from 'react';
import Button from './Button';

interface SocialCardProps {
  platform: string;
  description: string;
  href: string;
  buttonText: string;
  media?: ReactNode;
}

function SocialCard({ platform, description, href, buttonText, media }: SocialCardProps) {
  return (
    <div className="flex flex-col gap-3 p-6 border border-gray-300 rounded-lg bg-white">
      {media && <div className="overflow-hidden rounded-md">{media}</div>}
      <h3 className="text-xl font-semibold text-gray-900">{platform}</h3>
      <p className="text-gray-700 flex-1">{description}</p>
      <Button text={buttonText} href={href} target="_blank" className="self-start" />
    </div>
  );
}

export default SocialCard;
