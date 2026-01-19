import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const isAuthenticated = !!sessionStorage.getItem("auth_token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoutes;
