interface SubtitleProps {
  text: string;
  className?: string;
}

function Subtitle({ text, className }: SubtitleProps) {
  return (
    <h2 className={`text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 ${className ?? ''}`}>
      {text}
    </h2>
  );
}

export default Subtitle;
