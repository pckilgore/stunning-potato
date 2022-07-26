export const config = {
  meta: {
    env: import.meta.env.MODE,
  },
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
  sentry: {
    release: import.meta.env.REACT_APP_RELEASE,
    environment: import.meta.env.MODE,
    tracesSampleRate:
      import.meta.env.MODE === "development"
        ? 0
        : import.meta.env.MODE === "production"
        ? 0.1
        : 1.0,
    dsn:
      import.meta.env.MODE !== "development"
        ? import.meta.env.REACT_APP_SENTRY_DSN
        : null,
  },
};

if (import.meta.env.DEV) {
  console.log({ env: import.meta.env, config });
}
