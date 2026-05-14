import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Hamburger from "./Hamburger";
import NavbarLink from "./NavbarLink";

interface NavbarProps {
  links: { label: string; href: string }[];
}

function Navbar(props: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-b from-white via-gray-200 to-gray-300 border-b-5 border-black">
      <div className="flex items-center justify-between px-8 py-4">
        <RouterLink to="/" className="text-lg font-semibold tracking-tight text-gray-900">Purdue Mixed Media</RouterLink>
        <ul className="hidden sm:flex items-center gap-8">
          {props.links.map((link) => (
            <li key={link.href}>
              <NavbarLink label={link.label} to={link.href} />
            </li>
          ))}
        </ul>
        <Hamburger open={open} onToggle={() => setOpen(o => !o)} className="sm:hidden" />
      </div>
      <ul className={`sm:hidden flex flex-col px-8 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        {props.links.map((link) => (
          <li key={link.href}>
            <NavbarLink label={link.label} to={link.href} onClick={() => setOpen(false)} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
