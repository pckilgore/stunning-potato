export const config = {
  cognito: {
    region: import.meta.env.REACT_APP_AWS_REGION,
    userPoolId: import.meta.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.REACT_APP_COGNITO_CLIENT_ID,
    oauth: {
      domain: import.meta.env.REACT_APP_COGNITO_DOMAIN,
      redirectSignIn: import.meta.env.REACT_APP_COGNITO_REDIRECT_SIGN_IN,
      redirectSignOut: import.meta.env.REACT_APP_COGNITO_REDIRECT_SIGN_OUT,
      clientId: import.meta.env.REACT_APP_COGNITO_CLIENT_ID,
    },
  },
};
