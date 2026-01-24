import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import PrivateRoutes from "./routes/PrivateRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { messaging } from "./config/firebase";
import { setupNotificationListener } from "./utils/notificationListener";
import Login from "./pages/Login";

// Website Pages
import { WebsiteLayout } from "./components/website/layout/WebsiteLayout";
import HomePage from "./pages/website/HomePage";
import PublicProjects from "./pages/website/PublicProjects";
import ProjectDetailPublic from "./pages/website/ProjectDetailPublic";
import AboutPage from "./pages/website/AboutPage";
import ContactPage from "./pages/website/ContactPage";
import BookSiteVisitPage from "./pages/website/BookSiteVisitPage";
import CareersPage from "./pages/website/CareersPage";

const AppRoutes = () => {
  const navigate = useNavigate(); 

  useEffect(() => {
    setupNotificationListener(messaging, navigate);
  }, [navigate]);

  return (
    <Routes>
      {/* Public Website Routes */}
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book-visit" element={<BookSiteVisitPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/projects-public" element={<PublicProjects />} />
        <Route path="/projects-public/:projectId" element={<ProjectDetailPublic />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Protected CRM Routes */}
      <Route element={<PrivateRoutes />}>
        {protectedRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
