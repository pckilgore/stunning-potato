import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import * as Cognito from "../providers/cognito";

export function RequireAuth(props: { children: React.ReactNode }) {
  const { loading, signedIn, user } = Cognito.useCognito();
  const location = useLocation();

  if (loading) return null;

  if (!signedIn || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{props.children}</>;
}
