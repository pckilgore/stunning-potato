import React from "react";
import Auth from "@aws-amplify/auth";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { CognitoUser } from "amazon-cognito-identity-js";

interface CognitoContextInterface {
  loading: boolean;
  signedIn: boolean;
  resendSignUp: () => Promise<any>;
  signInApple: () => Promise<CognitoUser>;
  signInGoogle: () => Promise<CognitoUser>;
  signIn: (email: string, password: string) => Promise<CognitoUser>;
  signOut: () => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  user: any;
  verify: (username: string, code: string) => Promise<any>;
}

const CognitoContext = React.createContext<CognitoContextInterface | undefined>(
  undefined
);

interface CognitoState {
  loading: boolean;
  signedIn: boolean;
}

export function CognitoProvider(props: any) {
  const [state, setState] = React.useState<CognitoState>({
    signedIn: false,
    loading: true
  });
  const [user, setUser] = React.useState<CognitoUser | null>(null);

  const cognito = React.useMemo(() => {
    Auth.configure({
      Auth: {
        region: process.env.REACT_APP_AWS_REGION,
        userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
        oauth: {
          domain: process.env.REACT_APP_COGNITO_DOMAIN,
          redirectSignIn: process.env.REACT_APP_COGNITO_REDIRECT_SIGN_IN,
          redirectSignOut: process.env.REACT_APP_COGNITO_REDIRECT_SIGN_OUT,
          scope: ["email", "openid"],
          clientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
          responseType: "code"
        }
      },
      Analytics: {
        disabled: true
      }
    });

    return Auth;
  }, []);

  React.useEffect(() => {
    cognito
      .currentAuthenticatedUser()
      .then((user: any) => {
        setUser(user.username);
        setState({
          loading: false,
          signedIn: true
        });
      })
      .catch(() => setState({ loading: false, signedIn: false }));
  }, [cognito]);

  const resendSignUp = (username: string): Promise<any> =>
    cognito.resendSignUp(username);

  const signIn = (username: string, password: string): Promise<any> =>
    cognito.signIn(username, password);

  const signInApple = () =>
    cognito.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Apple
    });

  const signInGoogle = () =>
    cognito.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google
    });

  const signOut = async (): Promise<any> => {
    await cognito.signOut();
    setUser(null);
    setState({ loading: false, signedIn: false });
  };

  const signUp = async (username: string, password: string): Promise<any> =>
    cognito.signUp({
      username,
      password
    });

  const verify = async (username: string, code: string): Promise<any> => {
    try {
      const response = await cognito.confirmSignUp(username, code);

      if (response === "CONFIRMED SUCCESS") {
        const user = await cognito
          .currentAuthenticatedUser()
          .then((user: any) => {
            setUser(user.attributes);

            return user.attributes;
          });

        return user;
      }

      throw new Error("Invalid authentication code.");
    } catch (error: any) {
      return error;
    }
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
        ...state
      }}
      {...props}
    />
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
  try {
    if (Auth) {
      const session = await Auth.currentSession();

      return session?.getAccessToken()?.getJwtToken();
    }

    return false;
  } catch (err) {
    console.log("ERR", err);
  }
}
