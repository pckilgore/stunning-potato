import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { startInspector } from "./inspect";

// on-start init.
import "./sentry";
import "./amplify-auth";

if (import.meta.env.DEV) {
  startInspector();
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
