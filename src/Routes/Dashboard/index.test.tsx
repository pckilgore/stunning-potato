import { render, screen } from "@testing-library/react";
import Dashboard from "./";

describe("<Dashboard />", () => {
  test("to render dashboard text", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("dashboard-container")).toHaveTextContent(
      "dashboard"
    );
  });
});
