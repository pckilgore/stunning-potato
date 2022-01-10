import { render, screen } from "@testing-library/react";
import Verify from "./";

describe("<Login />", () => {
  test("to render verify text", () => {
    render(<Verify />);
    expect(screen.getByTestId("verify-container")).toHaveTextContent("verify");
  });
});
