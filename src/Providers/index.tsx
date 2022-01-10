import * as Cognito from "./cognito";

type Props = {
  children: JSX.Element;
};

export default function AppProviders({ children }: Props) {
  return <Cognito.CognitoProvider>{children}</Cognito.CognitoProvider>;
}
