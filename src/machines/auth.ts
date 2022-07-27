import { createMachine, assign, Sender, StateFrom } from "xstate";

import type { UserModel } from "../models/User";
import type { ProfileModel } from "../models/Profile";
import { MS_SEC, SEC_MIN } from "../utils/time";

export type Events =
  | { type: "AUTHENTICATED"; user: UserModel }
  | { type: "NEEDS_TO_LOGIN"; destination?: string }
  | { type: "REGISTER" }
  | { type: "NEEDS_VERIFICATION"; verificationUsername?: string }
  | { type: "NEEDS_PROFILE" }
  | { type: "TOKEN_REFRESHED"; user: UserModel }
  | { type: "HAS_PROFILE" }
  | { type: "VERIFIED" }
  | { type: "SKIP_ONBOARDING" }
  | { type: "START_ONBOARDING" }
  | { type: "FORGOT_PASSWORD" };

export type Context = {
  user?: UserModel;
  profile?: ProfileModel;
  verificationUsername?: string;
  deepLinkIntention?: string;
};

export type SendFunction = Sender<Events>;
export type State = StateFrom<typeof machine>;

export const machine = createMachine(
  {
    tsTypes: {} as import("./auth.typegen").Typegen0,
    id: "auth",
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    initial: "init",
    states: {
      init: {
        invoke: {
          id: "getInitialState",
          src: "getInitialState",
        },
        on: {
          NEEDS_TO_LOGIN: {
            target: "logged_out",
            actions: ["setDeepLinkIntention"],
          },
          REGISTER: "registration",
          FORGOT_PASSWORD: "request_password_recovery",
          NEEDS_VERIFICATION: {
            target: "registration_verification",
            actions: "storeVerificationUsername",
          },
          AUTHENTICATED: {
            target: "check_profile",
            actions: "storeUser",
          },
        },
      },
      logged_out: {
        on: {
          REGISTER: "registration",
          FORGOT_PASSWORD: "request_password_recovery",
          NEEDS_VERIFICATION: {
            target: "registration_verification",
            actions: "storeVerificationUsername",
          },
          AUTHENTICATED: {
            target: "check_profile",
            actions: "storeUser",
          },
          NEEDS_TO_LOGIN: {
            target: "logged_out",
            actions: ["setDeepLinkIntention"],
          },
        },
      },
      logged_in: {
        entry: ["goToDeepLink", "removeDeepLinkIntention"],
        invoke: {
          id: "refreshToken",
          src: "refreshToken",
        },
        on: {
          TOKEN_REFRESHED: {
            actions: ["storeUser"],
          },
          NEEDS_TO_LOGIN: {
            target: "logged_out",
            actions: ["setDeepLinkIntention"],
          },
        },
        after: {
          REFRESH_TOKEN_DELAY: {
            target: "logged_in",
          },
        },
      },
      check_profile: {
        invoke: {
          src: (_, event) => (send) => {
            if (event.type === "AUTHENTICATED") {
              // TODO: Replace with real profile logic.
              const { sub } = event.user; // eslint-disable-line
              if (window.localStorage.getItem(sub)) {
                send("HAS_PROFILE");
              } else {
                send("NEEDS_PROFILE");
              }
            }
          },
        },
        on: {
          NEEDS_PROFILE: "setup_profile",
          HAS_PROFILE: "logged_in",
        },
      },
      registration: {
        on: {
          NEEDS_VERIFICATION: {
            target: "registration_verification",
            actions: "storeVerificationUsername",
          },
          AUTHENTICATED: {
            target: "check_profile",
            actions: "storeUser",
          },
          NEEDS_TO_LOGIN: "logged_out",
        },
      },
      request_password_recovery: {
        on: {
          NEEDS_VERIFICATION: {
            target: "reset_password",
            actions: "storeVerificationUsername",
          },
          NEEDS_TO_LOGIN: "logged_out",
        },
      },
      reset_password: {
        exit: ["clearVerificationUsername"],
        on: {
          NEEDS_TO_LOGIN: "logged_out",
          REGISTER: "registration",
          NEEDS_VERIFICATION: {
            target: "reset_password",
            actions: "storeVerificationUsername",
          },
        },
      },
      setup_profile: {
        on: {
          REGISTER: "registration",
          START_ONBOARDING: "onboarding",
        },
      },
      registration_verification: {
        entry: ["storeVerificationUsername"],
        exit: ["clearVerificationUsername"],
        on: {
          REGISTER: "registration",
          NEEDS_TO_LOGIN: "logged_out",
          VERIFIED: "registration_success",
        },
      },
      registration_success: {
        on: {
          NEEDS_TO_LOGIN: "logged_out",
        },
      },
      onboarding: {
        on: {
          SKIP_ONBOARDING: "logged_in",
          // eventually: onboarding machine...
        },
      },
    },
  },
  {
    delays: {
      REFRESH_TOKEN_DELAY: 15 * MS_SEC * SEC_MIN,
    },
    actions: {
      storeUser: assign({
        user: (_, event) => event?.user,
      }),
      storeVerificationUsername: assign({
        verificationUsername: (_, event) => {
          if (event.type === "NEEDS_VERIFICATION") {
            return event.verificationUsername;
          }
          return;
        },
      }),
      clearVerificationUsername: assign({
        verificationUsername: (_) => undefined,
      }),
      removeDeepLinkIntention: assign({
        deepLinkIntention: (_) => undefined,
      }),
      setDeepLinkIntention: assign({
        deepLinkIntention: (_, event) => {
          if (event.type === "NEEDS_TO_LOGIN") {
            return event.destination;
          }
          return;
        },
      }),
    },
  }
);
