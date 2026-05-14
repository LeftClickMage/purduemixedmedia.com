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
  /** Optional photographer credit shown in the bottom-right corner on hover. */
  photographer?: string;
  onLoad?: () => void;
  onLowLoad?: () => void;
}

interface PhotoCreditProps {
  name: string;
  hovered: boolean;
}

function PhotoCredit({ name, hovered }: PhotoCreditProps) {
  return (
    <div
      className={`absolute bottom-2 right-2 z-10 text-white text-xs px-2 py-1 bg-black/60 rounded transition-opacity duration-300 pointer-events-none ${hovered ? 'opacity-100' : 'opacity-0'}`}
    >
      📷 {name}
    </div>
  );
}

function Image({ src, lowSrc, alt, className, imgClassName, naturalHeight, photographer, onLoad, onLowLoad }: ImageProps) {
  const [lowLoaded, setLowLoaded] = useState(!lowSrc);
  const [highLoaded, setHighLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fadeClasses = isIOS ? '' : 'transition-opacity duration-700';

  const hoverHandlers = photographer
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      }
    : {};

  if (naturalHeight) {
    // The first available <img> renders in normal flow so its natural height drives the container.
    // The other image is positioned absolutely on top.
    const showHighInFlow = highLoaded;
    const fitClasses = `w-full h-auto block ${imgClassName ?? ''}`;
    const overlayClasses = `absolute inset-0 w-full h-full ${imgClassName ?? ''}`;

    return (
      <div
        {...hoverHandlers}
        className={`relative overflow-hidden ${src && !lowSrc ? 'bg-black' : 'bg-gray-300'} ${className ?? ''}`}
      >
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
        {photographer && <PhotoCredit name={photographer} hovered={hovered} />}
      </div>
    );
  }

  const imgClasses = `w-full h-full object-cover ${imgClassName ?? ''}`;
  return (
    <div
      {...hoverHandlers}
      className={`overflow-hidden ${src && !lowSrc ? 'bg-black' : 'bg-gray-300'} ${className ?? ''}`}
    >
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
        {photographer && <PhotoCredit name={photographer} hovered={hovered} />}
      </div>
    </div>
  );
}

export default Image;
