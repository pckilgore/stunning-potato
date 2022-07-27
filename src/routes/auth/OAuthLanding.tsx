import React from "react";
import { LoadSpin } from "../../design/LoadSpin";
import * as Auth from "../../providers/auth";

export function OAuthLanding() {
  const actions = Auth.useActions();

  React.useEffect(() => {
    actions.oAuthDone();
  }, []);

  return (
    <div className="flex h-96 justify-center items-center">
      <div className="w-16 h-16">
        <LoadSpin />
      </div>
    </div>
  );
}
