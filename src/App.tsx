import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./providers/auth";
import { Router } from "./router";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}
