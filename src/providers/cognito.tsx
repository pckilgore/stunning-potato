import React from "react";
import Auth from "@aws-amplify/auth";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { CognitoUser } from "amazon-cognito-identity-js";
import { config } from "../configuration";

const uninitializedCallback = <A, B>(a?: A, b?: B) => {
  return Promise.reject(`Cognito is not initialized. ${a} ${b}`);
};

const defaultContext = {
  loading: true,
  signedIn: false,
  user: null,
  resendSignUp: uninitializedCallback,
  signInApple: uninitializedCallback,
  signInGoogle: uninitializedCallback,
  signIn: uninitializedCallback,
  signOut: uninitializedCallback,
  signUp: uninitializedCallback,
  verify: uninitializedCallback,
};

// @tsignore
// eslint-disable-next-line
const CognitoContext = React.createContext<any>(undefined);

interface CognitoState {
  loading: boolean;
  signedIn: boolean;
}

export function CognitoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CognitoState>({
    signedIn: false,
    loading: true,
  });
  const [user, setUser] = React.useState<CognitoUser | null>(null);

  const cognito = React.useMemo(() => {
    Auth.configure({
      Auth: {
        ...config.cognito,
        oauth: {
          ...config.cognito.oauth,
          scope: ["email", "openid"],
          responseType: "code",
        },
      },
      Analytics: {
        disabled: true,
      },
    });

    return Auth;
  }, []);

  React.useEffect(() => {
    cognito
      .currentAuthenticatedUser()
      .then((user: unknown) => {
        setUser(user as any);
        setState({
          loading: false,
          signedIn: true,
        });
      })
      .catch(() => setState({ loading: false, signedIn: false }));
  }, [cognito]);

  const resendSignUp = (username: string) => cognito.resendSignUp(username);

  const signIn = (username: string, password: string) =>
    cognito.signIn(username, password);

  const signInApple = () =>
    cognito.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Apple,
    });

  const signInGoogle = () =>
    cognito.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });

  const signOut = async () => {
    await cognito.signOut();
    setUser(null);
    setState({ loading: false, signedIn: false });
  };

  const signUp = async (username: string, password: string) =>
    cognito.signUp({
      username,
      password,
    });

  const verify = async (username: string, code: string) => {
    const response = await cognito.confirmSignUp(username, code);

    if (response === "CONFIRMED SUCCESS") {
      const user = await cognito
        .currentAuthenticatedUser()
        .then((user: unknown) => {
          setUser(user as any);

          return user;
        });

      return user;
    }

    throw new Error("Invalid authentication code.");
  };

  return (
    <CognitoContext.Provider
      value={{
        resendSignUp,
        signInApple,
        signInGoogle,
        signIn,
        signOut,
        signUp,
        user,
        verify,
        ...state,
      }}
    >
      {children}
    </CognitoContext.Provider>
  );
}

export function useCognito() {
  const context = React.useContext(CognitoContext);

  if (context === undefined) {
    throw new Error("useCognito must be used within a CognitoProvider.");
  }

  return context;
}

export async function getToken() {
  if (Auth) {
    const session = await Auth.currentSession();

    return session?.getAccessToken()?.getJwtToken();
  }

  return "";
}

export function TestProvider({
  value,
  children,
}: {
  value?: object;
  children: React.ReactNode;
}) {
  return (
    <CognitoContext.Provider value={{ ...defaultContext, ...value }}>
      {children}
    </CognitoContext.Provider>
  );
}
