import { render, screen } from "@testing-library/react";
import Login from "./";

describe("<Login />", () => {
  test("to render login text", () => {
    render(<Login />);
    expect(screen.getByTestId("login-container")).toHaveTextContent("login");
  });
});
