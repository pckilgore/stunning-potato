import { render, screen } from "@testing-library/react";
import Register from "./";

describe("<Register />", () => {
  test("to render register text", () => {
    render(<Register />);
    expect(screen.getByTestId("register-container")).toHaveTextContent(
      "register"
    );
  });
});
