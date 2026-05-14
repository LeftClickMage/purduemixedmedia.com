import { useState } from 'react';

const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

interface ImageProps {
  src?: string;
  lowSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onLoad?: () => void;
  onLowLoad?: () => void;
}

function Image({ src, lowSrc, alt, className, imgClassName, onLoad, onLowLoad }: ImageProps) {
  const [lowLoaded, setLowLoaded] = useState(!lowSrc);
  const [highLoaded, setHighLoaded] = useState(false);
  const imgClasses = `w-full h-full object-cover ${imgClassName ?? ''}`;
  const fadeClasses = isIOS ? '' : 'transition-opacity duration-700';
  return (
    <div className={`overflow-hidden ${src && !lowSrc ? 'bg-black' : 'bg-gray-300'} ${className ?? ''}`}>
      <div className="relative w-full h-full">
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm font-medium">
            Image Unavailable
          </div>
        )}
        {src && lowSrc && (
          <img
            src={lowSrc}
            alt=""
            aria-hidden
            onLoad={() => {
              setLowLoaded(true);
              onLowLoad?.();
            }}
            className={`absolute inset-0 scale-105 blur-md ${fadeClasses} ${highLoaded ? 'opacity-0' : 'opacity-100'} ${imgClasses}`}
          />
        )}
        {src && lowLoaded && (
          <img
            src={src}
            alt={alt}
            onLoad={() => {
              setHighLoaded(true);
              onLoad?.();
            }}
            className={`absolute inset-0 ${fadeClasses} ${highLoaded ? 'opacity-100' : 'opacity-0'} ${imgClasses}`}
          />
        )}
      </div>
    </div>
  );
}

export default Image;
