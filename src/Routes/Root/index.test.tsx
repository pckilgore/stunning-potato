import { render, screen } from "@testing-library/react";
import Root from "./";

describe("<Root />", () => {
  test("to render CLOUTY text", () => {
    render(<Root />);
    expect(screen.getByTestId("root-container")).toHaveTextContent("CLOUTY");
  });
});
