import { render, screen } from "../../utils/test-utils";
import Register from "./Register";

describe("<Register />", () => {
  test("to render register text", () => {
    render(<Register />);
    expect(screen.getByTestId("register-container")).toHaveTextContent(
      "register"
    );
  });
});
