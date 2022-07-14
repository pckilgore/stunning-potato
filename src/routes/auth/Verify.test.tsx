import { render, screen } from "../../utils/test-utils";
import Verify from "./Verify";

describe("<Verify />", () => {
  test("to render verify text", () => {
    render(<Verify />);
    expect(screen.getByTestId("verify-container")).toHaveTextContent("verify");
  });
});
