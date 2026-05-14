interface ButtonProps {
  text: string;
  href?: string;
  target?: '_blank' | '_self';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

const baseClasses = "px-5 py-2 bg-black text-white border-2 border-black text-sm font-medium rounded-md hover:bg-gold-600 hover:text-black transition-colors";

function Button({ text, href, target, type, onClick, className }: ButtonProps) {
  const classes = `${baseClasses} ${className ?? ''}`;
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        className={classes}
      >
        {text}
      </a>
    );
  }
  return (
    <button type={type ?? 'button'} onClick={onClick} className={classes}>
      {text}
    </button>
  );
}

export default Button;
