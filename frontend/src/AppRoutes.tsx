import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import PrivateRoutes from "./routes/PrivateRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { messaging } from "./config/firebase";
import { setupNotificationListener } from "./utils/notificationListener";
import Login from "./pages/Login";

const AppRoutes = () => {
  const navigate = useNavigate(); // ✅ VALID (inside Router)

  useEffect(() => {
    setupNotificationListener(messaging, navigate);
  }, [navigate]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
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
