import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import * as Cognito from "./providers/cognito";

const Login = React.lazy(() => import("./routes/auth/Login"));
const Dashboard = React.lazy(() => import("./routes/auth/Dashboard"));
const Register = React.lazy(() => import("./routes/auth/Register"));
const Verify = React.lazy(() => import("./routes/auth/Verify"));
const Root = React.lazy(() => import("./routes/auth/Root"));

export function Router() {
  const { loading, signedIn, user } = Cognito.useCognito();

  if (loading) return null;

  return (
    <BrowserRouter>
      <React.Suspense fallback={null}>
        <div className="min-h-screen">
          <Routes>
            <Route
              path={`/dashboard/*`}
              element={
                <RequireAuth signedIn={signedIn} user={user}>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path={`/verify`} element={<Verify />} />;
            <Route path={`/login`} element={<Login />} />;
            <Route path={`/register`} element={<Register />} />;
            <Route path={`/`} element={<Root />} />;
          </Routes>
        </div>
      </React.Suspense>
    </BrowserRouter>
  );
}

interface Props {
  children: JSX.Element;
  signedIn: boolean;
  user: unknown;
}

function RequireAuth(props: Props) {
  const { signedIn, user } = props;
  const location = useLocation();

  if (!signedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return props.children;
}
