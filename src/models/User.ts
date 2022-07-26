import type { CognitoUser } from "@aws-amplify/auth";
import * as yup from "yup";

const schema = yup.object({
  accessToken: yup.string().required(),
  sub: yup.string().required(),
  email_verified: yup.boolean().required(),
  iss: yup.string().required(),
  aud: yup.string().required(),
  auth_time: yup.number().required(),
  exp: yup.number().required(),
  iat: yup.number().required(),
  email: yup.string().email().required(),
});

/**
 * This is a minimal model representing the current user from AWS Cognito.
 *
 * Essentially, it's the contents of a cognito idToken, plus the accessToken.
 *
 * See also: Profile
 */
export type UserModel = yup.InferType<typeof schema>;

/**
 * Make UserModel from CognitoUser
 */
export function fromCognitoUser(user: CognitoUser): UserModel {
  const id = user.getSignInUserSession()?.getIdToken().payload;
  const token = user.getSignInUserSession()?.getAccessToken().getJwtToken();
  return schema.validateSync({ ...id, accessToken: token });
}
