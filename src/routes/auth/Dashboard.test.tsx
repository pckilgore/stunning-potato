import { render, screen } from "../../utils/test-utils";
import Dashboard from "./Dashboard";

describe("<Dashboard />", () => {
  test("to render dashboard text", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("dashboard-container")).toHaveTextContent(
      "dashboard"
    );
  });
});
