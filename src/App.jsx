import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { PageTransition, Preloader } from "./Components/MotionEffects";

import Login from "./pages/Login/Login";
import AdminLayout from "./admin/AdminLayout";
import SalesReport from "./admin/pages/SalesReport/SalesReport";
import EventEndReport from "./admin/pages/EventEndReport/EventEndReport";
import EventsPage from "./admin/pages/EventsPage/EventsPage";
import ArtistsPage from "./admin/pages/ArtistsPage/ArtistsPage";
import EventPhasesPage from "./admin/pages/EventPhasesPage/EventPhasesPage";
import ClubsPage from "./admin/pages/ClubsPage/ClubsPage";
import ClubManagersPage from "./admin/pages/ClubManagersPage/ClubManagersPage";
import CategoriesPage from "./admin/pages/CategoriesPage/CategoriesPage";
import GenresPage from "./admin/pages/GenresPage/GenresPage";
import UtilityPage from "./admin/pages/UtilityPage/UtilityPage";

function RoutedApp() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      {isLoginPage && <Preloader />}
      <a className="skip-link" href="#route-content">
        Skip to main content
      </a>
      <div id="route-content" tabIndex={-1}>
        <PageTransition>
          <Routes location={location}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate replace to="sales-report" />} />
              <Route path="sales-report" element={<SalesReport />} />
              <Route path="event-end-report" element={<EventEndReport />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="artists" element={<ArtistsPage />} />
              <Route path="event-phases" element={<EventPhasesPage />} />
              <Route path="clubs" element={<ClubsPage />} />
              <Route path="club-managers" element={<ClubManagersPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="genres" element={<GenresPage />} />
              <Route path="venue-booking" element={<UtilityPage title="Venue & Table Booking" />} />
              <Route path="change-password" element={<UtilityPage section="Apps" title="Change Password" />} />
              <Route path="*" element={<Navigate replace to="/admin/sales-report" />} />
            </Route>
            <Route path="*" element={<Login />} />
          </Routes>
        </PageTransition>
      </div>
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