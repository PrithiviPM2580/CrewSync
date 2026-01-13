import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoute from "./auth";
import BaseLayout from "@/layout/base";
import { authenticationRoutePaths } from "./common/routes";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route element={<BaseLayout />}>
            {authenticationRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
