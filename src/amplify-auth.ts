import { Auth } from "@aws-amplify/auth";
import { config } from "./configuration";

Auth.configure({
  Auth: {
    ...config.cognito,
    oauth: {
      ...config.cognito.oauth,
      scope: ["email", "openid"],
      responseType: "code",
    },
  },
});

