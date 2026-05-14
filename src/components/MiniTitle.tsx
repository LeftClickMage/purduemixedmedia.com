interface MiniTitleProps {
  text: string;
  className?: string;
}

function MiniTitle({ text, className }: MiniTitleProps) {
  return (
    <h2 className={`text-lg sm:text-xl font-semibold ${className ?? ''}`}>
      {text}
    </h2>
  );
}

export default MiniTitle;
