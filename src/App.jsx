import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "./Components/Sidebar";
import {
  CustomCursor,
  GrainOverlay,
  PageTransition,
  Preloader,
  ScrollReveal,
  SmoothScroll,
} from "./Components/MotionEffects";

import Home from "./pages/Home";
import Evenings from "./pages/Evenings";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import MyAccount from "./pages/Myaccount";
import PrivateEvents from "./pages/PrivateEvents";

function RoutedApp() {
  const location = useLocation();

  return (
    <>
      <Preloader />
      <a className="skip-link" href="#route-content">
        Skip to main content
      </a>
      <Sidebar />
      <div id="route-content" tabIndex={-1}>
        <ScrollReveal />
        <PageTransition>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/evenings" element={<Evenings />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/private-events" element={<PrivateEvents />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </PageTransition>
      </div>
      <SmoothScroll />
      <GrainOverlay />
      <CustomCursor />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div id="site-shell">
        <RoutedApp />
      </div>
    </BrowserRouter>
  );
}

export default App;