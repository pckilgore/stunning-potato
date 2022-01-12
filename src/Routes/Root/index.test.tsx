import { render, screen } from "utils/test/render";
import Root from "./";

describe("<Root />", () => {
  test("to render CLOUTY text", () => {
    render(<Root />);
    expect(screen.getByTestId("root-container")).toHaveTextContent("CLOUTY");
  });
});
