import { useState } from 'react';

const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

interface ImageProps {
  src?: string;
  lowSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** When true, the image dictates the container's height (intrinsic) instead of filling its parent. */
  naturalHeight?: boolean;
  onLoad?: () => void;
  onLowLoad?: () => void;
}

function Image({ src, lowSrc, alt, className, imgClassName, naturalHeight, onLoad, onLowLoad }: ImageProps) {
  const [lowLoaded, setLowLoaded] = useState(!lowSrc);
  const [highLoaded, setHighLoaded] = useState(false);
  const fadeClasses = isIOS ? '' : 'transition-opacity duration-700';

  if (naturalHeight) {
    // The first available <img> renders in normal flow so its natural height drives the container.
    // The other image is positioned absolutely on top.
    const showHighInFlow = highLoaded;
    const fitClasses = `w-full h-auto block ${imgClassName ?? ''}`;
    const overlayClasses = `absolute inset-0 w-full h-full ${imgClassName ?? ''}`;

    return (
      <div className={`relative overflow-hidden ${src && !lowSrc ? 'bg-black' : 'bg-gray-300'} ${className ?? ''}`}>
        {!src && (
          <div className="flex items-center justify-center text-gray-600 text-sm font-medium py-8">
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
            className={`scale-105 blur-md ${fadeClasses} ${highLoaded ? 'opacity-0' : 'opacity-100'} ${showHighInFlow ? overlayClasses : fitClasses}`}
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
            className={`${fadeClasses} ${highLoaded ? 'opacity-100' : 'opacity-0'} ${showHighInFlow ? fitClasses : overlayClasses}`}
          />
        )}
      </div>
    );
  }

  const imgClasses = `w-full h-full object-cover ${imgClassName ?? ''}`;
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
