import { useState, useEffect, useRef } from 'react';
import Image from './Image';

interface CarouselImage {
  src: string;
  lowSrc?: string;
  photographer?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  interval?: number;
  onSlideChange?: (index: number) => void;
  onFirstLowResLoaded?: () => void;
}

const MANUAL_PAUSE_MS = 5000;

function ImageCarousel(props: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [manualPauseUntil, setManualPauseUntil] = useState(0);
  const lowResFiredRef = useRef(false);

  const handleLowLoad = () => {
    if (lowResFiredRef.current) return;
    lowResFiredRef.current = true;
    props.onFirstLowResLoaded?.();
  };

  useEffect(() => {
    if (props.images.length <= 1) return;
    const delay = Math.max(manualPauseUntil - Date.now(), 0);
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const startTimeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setCurrent(i => (i + 1) % props.images.length);
      }, props.interval);
    }, delay);
    return () => {
      clearTimeout(startTimeoutId);
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [props.images.length, props.interval, manualPauseUntil]);

  const handleDotClick = (i: number) => {
    setCurrent(i);
    setManualPauseUntil(Date.now() + MANUAL_PAUSE_MS);
  };

  useEffect(() => {
    props.onSlideChange?.(current);
  }, [current]);

  return (
    <div
      className="relative w-full h-full bg-black border-b-5 border-black select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {props.images.map((image, i) => (
        <div
          key={image.src}
          className="absolute inset-0"
          style={{ visibility: i === current ? 'visible' : 'hidden' }}
        >
          <Image
            src={image.src}
            lowSrc={image.lowSrc}
            alt={`carousel ${i + 1}`}
            onLowLoad={handleLowLoad}
            className="absolute inset-0"
          />
        </div>
      ))}
      {props.images[current].photographer && (
        <div className={`absolute bottom-8 right-3 z-10 text-white text-xs px-2 py-1 bg-black/50 rounded transition-opacity duration-300 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}>
          📷 {props.images[current].photographer}
        </div>
      )}
      {props.images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {props.images.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;
