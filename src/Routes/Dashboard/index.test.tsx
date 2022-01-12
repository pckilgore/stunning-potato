import { render, screen } from "utils/test/render";
import Dashboard from "./";

describe("<Dashboard />", () => {
  test("to render dashboard text", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("dashboard-container")).toHaveTextContent(
      "dashboard"
    );
  });
});
