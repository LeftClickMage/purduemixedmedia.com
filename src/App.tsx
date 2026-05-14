import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import OfficersPage from "./pages/OfficersPage";
import MediaPage from "./pages/MediaPage";
import ContactPage from "./pages/ContactPage";
import Navbar from "./components/Navbar";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Officers", href: "/officers" },
  { label: "Events", href: "/events" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
];

function App() {
  return (
    <BrowserRouter>
      <Navbar links={navLinks} />
      <div className="pt-15">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/officers" element={<OfficersPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App;