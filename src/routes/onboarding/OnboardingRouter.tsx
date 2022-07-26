import { Route, Routes } from "react-router-dom";
import { Root } from "./Root";

export default function OnboardingRouter() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
    </Routes>
  );
}
