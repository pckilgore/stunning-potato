import React from "react";
import * as Auth from "../../providers/auth";

export function Logout() {
  const { signOut } = Auth.useActions();

  React.useEffect(() => {
    signOut();
  }, []);

  return null;
}
