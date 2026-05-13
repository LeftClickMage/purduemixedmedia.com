import { useState } from 'react';

interface ImageProps {
  src: string;
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
  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <div className="relative w-full h-full">
        {lowSrc && (
          <img
            src={lowSrc}
            alt=""
            aria-hidden
            onLoad={() => {
              setLowLoaded(true);
              onLowLoad?.();
            }}
            className={`absolute inset-0 scale-105 blur-md transition-opacity duration-700 ${highLoaded ? 'opacity-0' : 'opacity-100'} ${imgClasses}`}
          />
        )}
        {lowLoaded && (
          <img
            src={src}
            alt={alt}
            onLoad={() => {
              setHighLoaded(true);
              onLoad?.();
            }}
            className={`absolute inset-0 transition-opacity duration-700 ${highLoaded ? 'opacity-100' : 'opacity-0'} ${imgClasses}`}
          />
        )}
      </div>
    </div>
  );
}

export default Image;
