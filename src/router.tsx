import React from "react";
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "./providers/auth";

const Dashboard = React.lazy(() => import("./routes/Dashboard"));
const Root = React.lazy(() => import("./routes/Root"));
const AuthRouter = React.lazy(() => import("./routes/auth/AuthRouter"));
const OnboardingRouter = React.lazy(
  () => import("./routes/onboarding/OnboardingRouter")
);

export function Router() {
  return (
    <React.Suspense fallback={null}>
      <Routes>
        <Route path="auth/*" element={<AuthRouter />} />
        <Route path="onboarding/*" element={<OnboardingRouter />} />
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
  );
}
