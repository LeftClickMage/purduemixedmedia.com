import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

interface NavbarProps {
  links: { label: string; href: string }[];
}

function Navbar(props: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b-5 border-black">
      <div className="flex items-center justify-between px-8 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900">Purdue Mixed Media</Link>
        <ul className="hidden sm:flex items-center gap-8">
          {props.links.map((link) => (
            <li key={link.href}>
              <NavLink to={link.href} className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          className="sm:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-900 transition-transform duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-900 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-900 transition-transform duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>
      <ul className={`sm:hidden flex flex-col px-8 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        {props.links.map((link) => (
          <li key={link.href}>
            <NavLink
              to={link.href}
              className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
