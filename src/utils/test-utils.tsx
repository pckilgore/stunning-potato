import React from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";

import { BrowserRouter } from "react-router-dom";

afterEach(() => {
  cleanup();
});

const WrapWithProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <WrapWithProviders>{children}</WrapWithProviders>
    ),
    ...options,
  });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };
