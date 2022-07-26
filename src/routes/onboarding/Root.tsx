import React from "react";

import * as Auth from "../../providers/auth";

export function Root() {
  const actions = Auth.useActions();

  React.useEffect(() => {
    actions.onboarding.skip();
  }, []);

  return null;
}
