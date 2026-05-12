import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import Navbar from "./components/Navbar";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Officers", href: "/officers" },
  { label: "Events", href: "/events" },
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
      </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;