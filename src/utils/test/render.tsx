import React from "react";
import { render } from "@testing-library/react";
import { default as Auth } from "@aws-amplify/auth";

import * as Cognito from "Providers/cognito";
import { BrowserRouter } from "react-router-dom";

const WrapWithProviders = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });

    Auth.currentSession = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        getAccessToken: () => ({
          getJwtToken: () => "alfksdjlfkjladkfwioejkl"
        })
      });
    });
  }, []);

  return (
    <Cognito.TestProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </Cognito.TestProvider>
  );
};

const customRender = (
  ui: Parameters<typeof render>[0],
  extra?: {
    options?: Parameters<typeof render>[1];
  }
) =>
  render(ui, {
    wrapper(props) {
      return <WrapWithProviders {...props}>{props.children}</WrapWithProviders>;
    },
    ...extra?.options
  });

// Disabling the import/export linter rules because we need all of
// the exports from testing library except for one which we replace
// in the following line.
// eslint-disable-next-line import/export
export * from "@testing-library/react";
// eslint-disable-next-line import/export
export { customRender as render };
