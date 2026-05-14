import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Hamburger from "./Hamburger";
import NavbarLink from "./NavbarLink";
import pageIcon from "../assets/PurdueMixedMediaLogo.jpg";

interface NavbarProps {
  links: { label: string; href: string }[];
}

function Navbar(props: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-b from-white via-gray-200 to-gray-300 border-b-5 border-black">
      <div className="flex items-center justify-between px-8 py-4">
        <RouterLink to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-gray-900">
          <img src={pageIcon} alt="Purdue Mixed Media logo" className="h-10 w-10 rounded-md object-cover border-2 border-black" />
          <span>Purdue Mixed Media</span>
        </RouterLink>
        <ul className="hidden md:flex items-center gap-8">
          {props.links.map((link) => (
            <li key={link.href}>
              <NavbarLink label={link.label} to={link.href} />
            </li>
          ))}
        </ul>
        <Hamburger open={open} onToggle={() => setOpen(o => !o)} className="md:hidden" />
      </div>
      <ul className={`md:hidden flex flex-col px-8 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 pb-4' : 'max-h-0'}`}>
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
