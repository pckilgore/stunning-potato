import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";

const Dashboard = React.lazy(() => import("./routes/Dashboard"));
const Root = React.lazy(() => import("./routes/Root"));
const AuthRouter = React.lazy(() => import("./routes/auth/AuthRouter"));

export function Router() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="auth/*" element={<AuthRouter />} />
          <Route
            path={`/dashboard/*`}
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path={`/`}
            element={
              <RequireAuth>
                <Root />
              </RequireAuth>
            }
          />
          ;
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
