import { Outlet, Navigate } from "react-router-dom";

const AuthRoute = () => {
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default AuthRoute;
