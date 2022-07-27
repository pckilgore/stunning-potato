import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { Button } from "../../design/Button";
import { FormError } from "./FormError";
import { PasswordInput } from "../../design/PasswordInput";
import { Text } from "../../design/Text";
import { TextInput } from "../../design/TextInput";

import * as Auth from "../../providers/auth";
import { meetsPasswordBreachRequirements } from "../../utils/authentication";

const ResetSchema = Yup.object().shape({
  username: Yup.string().email().required(),
  code: Yup.string()
    .required("Code is required")
    .trim()
    .length(6, "Code must be exactly 6 characters.")
    .matches(/^[\d]{6}$/, "You must only type numbers for the code."),
  password: Yup.string()
    .min(8, "Passwords must be longer than 8 characters.")
    .required("You must create a new password."),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match.")
    .required("Must confirm password by typing it again."),
});

export function ResetPassword() {
  const { state, actions } = Auth.useAuth();
  const username = state.context.verificationUsername ?? "";

  return (
    <Formik
      validationSchema={ResetSchema}
      validateOnChange={false}
      initialValues={{
        username,
        password: "",
        code: "",
        confirm: "",
      }}
      onSubmit={async (data, { setFieldError }) => {
        try {
          const passwordOK = await meetsPasswordBreachRequirements(
            data.password
          );

          if (!passwordOK) {
            return setFieldError(
              "password",
              "This password is known to be weak. You must choose a different password."
            );
          }

          await actions.forgotPasswordSubmit(data);
        } catch (error) {
          console.warn({ authResponse: error });
          setFieldError("code", "Wrong code. Try again.");
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="max-w-lg bg-dark-background-200">
          <div className="flex flex-wrap pt-8 px-8">
            <Text as="h1" variant="h4" color="text-dark-gray-700">
              Enter the verification code here
            </Text>
            <Text
              variant="body-small"
              color="text-dark-gray-600"
              className="py-2"
            >
              Verification code has been sent to <b>{username}</b> <br />
              If you don't see the email, please check your spam folder.
            </Text>
            <Field type="hidden" name="username" />
            <div className="w-full pt-4">
              <Field
                as={TextInput}
                id="forgot-reset-code"
                aria-errormessage="code-error"
                label="Verification Code"
                name="code"
                autoComplete="one-time-code"
                error={touched.code && Boolean(errors.code)}
              />
              <FormError id="code-error" name="code" />
            </div>
            <div className="flex gap-x-2 py-6 items-center">
              <Text as="label" variant="body-small" color="text-dark-gray-600">
                Did not get the email?
              </Text>
              <Button
                variant="tiny"
                onClick={() => actions.forgotPassword({ username })}
              >
                Send again
              </Button>
            </div>
          </div>
          <div className="flex flex-col bg-dark-background-100 gap-y-4 px-8 py-6">
            <Field
              as={PasswordInput}
              id="forgot-password-input"
              aria-errormessage="password-error"
              name="password"
              label="New Password"
              autoComplete="new-password"
              error={touched.password && Boolean(errors.password)}
            />
            <FormError id="password-error" name="password" />
            <Field
              as={PasswordInput}
              id="forgot-password-confirm"
              aria-errormessage="confirm-error"
              name="confirm"
              label="Confirm Password"
              autoComplete="new-password"
              error={touched.confirm && Boolean(errors.confirm)}
            />
            <FormError id="confirm-error" name="confirm" />
            <div className="pt-6">
              <Button type="submit">Save and Login</Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
