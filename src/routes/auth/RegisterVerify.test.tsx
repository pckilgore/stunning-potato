import { render, screen } from "../../utils/test-utils";
import { RegisterVerify } from "./RegisterVerify";

describe("<Verify />", () => {
  test("to render verify text", () => {
    render(<RegisterVerify />);
    expect(screen.getByTestId("verify-container")).toHaveTextContent("verify");
  });
});
