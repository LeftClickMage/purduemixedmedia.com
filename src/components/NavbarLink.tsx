import { NavLink } from 'react-router-dom';

interface NavbarLinkProps {
  label: string;
  to: string;
  onClick?: () => void;
  className?: string;
}

function NavbarLink({ label, to, onClick, className }: NavbarLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-gold-700 font-bold' : 'text-gray-500 hover:text-gold-600'} ${className ?? ''}`}
    >
      {label}
    </NavLink>
  );
}

export default NavbarLink;
