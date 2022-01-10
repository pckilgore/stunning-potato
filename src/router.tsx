import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from "react-router-dom";

import * as Cognito from "Providers/cognito";

const Login = React.lazy(() => import("Routes/Login"));
const Dashboard = React.lazy(() => import("Routes/Dashboard"));
const Register = React.lazy(() => import("Routes/Register"));
const Verify = React.lazy(() => import("Routes/Verify"));
const Root = React.lazy(() => import("Routes/Root"));

export default function Router() {
  const { loading, signedIn, user } = Cognito.useCognito();

  if (loading) return null;

  return (
    <BrowserRouter>
      <React.Suspense fallback={null}>
        <Routes>
          <Route
            path={`/dashboard/*`}
            element={
              <RequireAuth signedIn={signedIn} user={user}>
                <Dashboard />
              </RequireAuth>
            }
          />
          ;
          <Route path={`/verify`} element={<Verify />} />;
          <Route path={`/login`} element={<Login />} />;
          <Route path={`/register`} element={<Register />} />;
          <Route path={`/`} element={<Root />} />;
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

interface Props {
  children: JSX.Element;
  signedIn: boolean;
  user: any;
}

function RequireAuth(props: Props) {
  const { signedIn, user } = props;
  const location = useLocation();

  if (!signedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return props.children;
}
