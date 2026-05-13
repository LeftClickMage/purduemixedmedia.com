interface ButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  target?: '_blank' | '_self';
  className?: string;
}

const baseClasses = "px-5 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors";

function Button({ text, href, onClick, target, className }: ButtonProps) {
  const classes = `${baseClasses} ${className ?? ''}`;
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={classes}
      >
        {text}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={classes}>{text}</button>
  );
}

export default Button;
