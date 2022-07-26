import React from "react";
import * as Sentry from "@sentry/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Auth,
  CognitoHostedUIIdentityProvider,
  CognitoUser,
} from "@aws-amplify/auth";
import { Hub, HubCapsule } from "@aws-amplify/core";
import { useMachine } from "@xstate/react";

import { fromCognitoUser } from "../models/User";
import { machine, State, SendFunction } from "../machines/auth";

type Credentials = {
  username: string;
  password: string;
};

type Code = {
  code: string;
};

/**
 * Our complete authentication API. Responsible for coordinating events from
 * Amplify-Auth and our own business logic into a single service.
 *
 * Consumed by the useActions or useAuth hooks below.
 *
 * Error handling should be performed by the component invoking these actions
 * for appropriate UI feedback, unless we *know* we can handle automatically.
 */
const createActions = (send: SendFunction) => ({
  requestLogin: () => send("NEEDS_TO_LOGIN"),
  requestRegistration: () => send("REGISTER"),
  requestForgotPassword: () => send("FORGOT_PASSWORD"),
  requestVerification: () => send("NEEDS_VERIFICATION"),

  oAuthDone: async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const user = fromCognitoUser(cognitoUser);
      send({ type: "AUTHENTICATED", user });
    } catch (err) {
      Sentry.captureException(err);
      send("NEEDS_TO_LOGIN");
    }
  },

  onboarding: {
    start: () => send("START_ONBOARDING"),
    skip: () => {
      send("SKIP_ONBOARDING");
    },
  },

  unauthorized: (destination: string) =>
    send({ type: "UNAUTHORIZED", destination }),

  signIn: async ({ username, password }: Credentials) => {
    const cognitoUser: CognitoUser = await Auth.signIn(username, password);
    const user = fromCognitoUser(cognitoUser);
    send({ type: "AUTHENTICATED", user });
  },

  signUp: async ({ username, password }: Credentials) => {
    const res = await Auth.signUp({ username, password });

    if (!res.userConfirmed) {
      send({ type: "NEEDS_VERIFICATION", verificationUsername: username });
    }
  },

  resendSignUp: async ({ username }: { username: string }) => {
    const res: { CodeDeliveryDetails?: { Destination?: string } } =
      await Auth.resendSignUp(username);

    return res?.CodeDeliveryDetails?.Destination ?? "your email";
  },

  forgotPassword: async ({ username }: { username: string }) => {
    await Auth.forgotPassword(username);
    send({ type: "NEEDS_VERIFICATION", verificationUsername: username });
  },

  forgotPasswordSubmit: async (params: Credentials & Code) => {
    const { username, password, code } = params;
    await Auth.forgotPasswordSubmit(username, code, password);
    send("NEEDS_TO_LOGIN");
  },

  signInApple: () =>
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Apple }),

  signInGoogle: () =>
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google }),

  signOut: async () => {
    await Auth.signOut();
    send("NEEDS_TO_LOGIN");
  },

  verify: async ({ username, code }: { username: string; code: string }) => {
    await Auth.confirmSignUp(username, code);
    send("VERIFIED");
  },
});

const StateContext = React.createContext<State | undefined>(undefined);
const ActionContext = React.createContext<
  ReturnType<typeof createActions> | undefined
>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [state, send] = useMachine(machine, {
    devTools: import.meta.env.MODE !== "production",
    services: {
      refreshToken: () => async (send) => {
        try {
          const cognitoUser = await Auth.currentAuthenticatedUser();
          const user = fromCognitoUser(cognitoUser);
          send({ type: "TOKEN_REFRESHED", user });
        } catch (err) {
          Sentry.captureException(err);
        }
      },
      getInitialState: () => async (send) => {
        try {
          const cognitoUser = await Auth.currentAuthenticatedUser();
          const user = fromCognitoUser(cognitoUser);
          send({ type: "AUTHENTICATED", user });
          return;
        } catch {
          // Not really an error, defer to path-based logic below.
        }

        if (pathname === "/auth/register/verify") {
          send("NEEDS_VERIFICATION");
        }
        if (pathname === "/auth/forgot-password") {
          send("FORGOT_PASSWORD");
        }
        if (pathname === "/auth/register") {
          send("REGISTER");
        } else {
          send({ type: "UNAUTHORIZED", destination: pathname });
        }
      },
    },
    actions: {
      goToDeepLink: ({ deepLinkIntention }) => {
        if (deepLinkIntention) {
          return navigate(deepLinkIntention);
        }
        navigate("/");
      },
    },
  });

  const actions = React.useMemo(() => createActions(send), [send]);

  React.useEffect(function cognitoSync() {
    async function authEventHandler({ payload }: HubCapsule) {
      const event = payload.event;

      if (event === "signOut") {
        send("NEEDS_TO_LOGIN");
      }

      if (event === "signIn_failure") {
        send("NEEDS_TO_LOGIN");
      }

      if (event === "tokenRefresh_failure") {
        send("NEEDS_TO_LOGIN");
      }
    }

    Hub.listen("auth", authEventHandler);
    return () => Hub.remove("auth", authEventHandler);
  }, []);

  React.useEffect(
    function syncUrlWithAuthState() {
      if (state.value === "logged_out") {
        navigate("/auth/login");
      }
      if (state.value === "registration") {
        navigate("/auth/register");
      }
      if (state.value === "registration_verification") {
        navigate("/auth/register/verify");
      }
      if (state.value === "setup_profile") {
        navigate("/auth/register/profile");
      }
      if (state.value === "request_password_recovery") {
        navigate("/auth/forgot-password");
      }
      if (state.value === "reset_password") {
        navigate("/auth/reset-password");
      }
      if (state.value === "registration_success") {
        navigate("/auth/register/success");
      }
      if (state.value === "onboarding") {
        navigate("/onboarding/");
      }
    },
    [state.value]
  );

  return (
    <StateContext.Provider value={state}>
      <ActionContext.Provider value={actions}>
        {children}
      </ActionContext.Provider>
    </StateContext.Provider>
  );
}

export function useActions() {
  const send = React.useContext(ActionContext);
  if (typeof send === "undefined") {
    throw Error("useSend missing Provider");
  }
  return send;
}

export function useState() {
  const state = React.useContext(StateContext);
  if (typeof state === "undefined") {
    throw Error("useSend missing Provider");
  }
  return state;
}

/**
 * Retreive both auth state and actions.
 */
export function useAuth() {
  const actions = useActions();
  const state = useState();
  return { actions, state };
}

/**
 * Requre a logged in user to view this components children.
 *
 * Captures the current
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { state, actions } = useAuth();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    if (state.value !== "logged_in") {
      actions.unauthorized(`${pathname}${search}`);
      navigate("/auth/login");
    }
  }, [state.value]);

  if (state.value === "logged_in") {
    return <>{children}</>;
  }

  return null;
}
