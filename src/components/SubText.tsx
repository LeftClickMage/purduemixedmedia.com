interface SubTextProps {
  text: string;
  className?: string;
}

function SubText({ text, className }: SubTextProps) {
  return (
    <p className={`text-sm text-gray-500 ${className ?? ''}`}>
      {text}
    </p>
  );
}

export default SubText;
