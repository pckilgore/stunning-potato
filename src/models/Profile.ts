import { sub } from "date-fns";
/**
 * This is a minimal model representing the current user from AWS Cognito.
 *
 * See also: Profile
 */

/**
 *  An instance of a Row of the profile model.
 *
 *  Should contain foreign keys but relations should only be attached to the
 *  type when they are queried, e.g.:
 *
 *  type MyEagerQueryModel = ProfileModel & {
 *    user: UserModel
 *  }
 *
 *  Temporary models can be created via Omit:
 *  type JustFirst = Omit<ProfileModel, 'birthDate' | 'lastName'>
 *
 *  Models used more than once should be given a name an kept here:
 *  type NameOnlyProfile = {
 *    firstName: string
 *    lastName: string
 *  }
 *
 */
export type ProfileModel = {
  firstName: string;
  lastName: string;
  birthDate: Date;
};

export const getMinBirthdate = () =>
  sub(new Date(Date.now()), { years: 18, days: 1 });
