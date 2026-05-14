interface ButtonProps {
  text: string;
  href: string;
  target?: '_blank' | '_self';
  className?: string;
}

const baseClasses = "px-5 py-2 bg-black text-white border-2 border-black text-sm font-medium rounded-md hover:bg-gold-600 hover:text-black transition-colors";

function Button({ text, href, target, className }: ButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`${baseClasses} ${className ?? ''}`}
    >
      {text}
    </a>
  );
}

export default Button;
