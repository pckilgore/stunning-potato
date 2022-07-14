import { render, screen } from "../../utils/test-utils";
import Root from "./Root";

describe("<Root />", () => {
  test("to render CLOUTY text", () => {
    render(<Root />);
    expect(screen.getByTestId("root-container")).toHaveTextContent("CLOUTY");
  });
});
