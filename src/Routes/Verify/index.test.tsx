import { render, screen } from "utils/test/render";
import Verify from "./";

describe("<Verify />", () => {
  test("to render verify text", () => {
    render(<Verify />);
    expect(screen.getByTestId("verify-container")).toHaveTextContent("verify");
  });
});
