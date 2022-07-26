import { render, screen } from "../../utils/test-utils";
import { Login } from "./Login";

describe("<Login />", () => {
  test("to render login text", () => {
    render(<Login />);
    expect(screen.getByText(/Google/)).toBeInTheDocument();
  });
});
