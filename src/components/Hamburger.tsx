interface HamburgerProps {
  open: boolean;
  onToggle: () => void;
  className?: string;
}

function Hamburger({ open, onToggle, className }: HamburgerProps) {
  return (
    <button
      className={`flex flex-col gap-1.5 p-1 ${className ?? ''}`}
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      <span className={`block w-6 h-0.5 bg-gray-900 transition-transform duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
      <span className={`block w-6 h-0.5 bg-gray-900 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
      <span className={`block w-6 h-0.5 bg-gray-900 transition-transform duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
    </button>
  );
}

export default Hamburger;
