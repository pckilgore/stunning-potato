import { CognitoProvider } from "./providers/cognito";
import { Router } from "./router";

export default function App() {
  return (
    <CognitoProvider>
      <Router />
    </CognitoProvider>
  );
}
