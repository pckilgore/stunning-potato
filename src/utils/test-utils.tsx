import React from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";
import Auth from "@aws-amplify/auth";

import * as Cognito from "../providers/cognito";
import { BrowserRouter } from "react-router-dom";

afterEach(() => {
  cleanup();
});

const WrapWithProviders = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    Auth.currentAuthenticatedUser = vi.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });

    Auth.currentSession = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        getAccessToken: () => ({
          getJwtToken: () => "alfksdjlfkjladkfwioejkl",
        }),
      });
    });
  }, []);

  return (
    <Cognito.TestProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </Cognito.TestProvider>
  );
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
