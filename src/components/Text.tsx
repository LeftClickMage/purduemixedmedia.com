interface TextProps {
  text: string;
  className?: string;
}

function Text({ text, className }: TextProps) {
  return (
    <p className={`text-gray-700 ${className ?? ''}`}>
      {text}
    </p>
  );
}

export default Text;
