import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  label: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const baseClasses = 'text-sm font-medium text-gray-500 hover:text-black transition-colors';

function Link({ label, to, href, onClick, className }: LinkProps) {
  const classes = `${baseClasses} ${className ?? ''}`;
  if (to) {
    return (
      <RouterLink to={to} onClick={onClick} className={classes}>
        {label}
      </RouterLink>
    );
  }
  return (
    <a
      href={href}
      onClick={onClick}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={classes}
    >
      {label}
    </a>
  );
}

export default Link;
