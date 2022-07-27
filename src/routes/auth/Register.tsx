import React from "react";
import { Formik, Form, Field } from "formik";
import * as Sentry from "@sentry/react";
import * as Yup from "yup";

import * as Auth from "../../providers/auth";
import { meetsPasswordBreachRequirements } from "../../utils/authentication";

import { Google, Apple } from "../../components/SocialIcons";

import { Button } from "../../design/Button";
import { OAuthButton } from "../../design/Button";
import { PasswordInput } from "../../design/PasswordInput";
import { Text } from "../../design/Text";
import { TextInput } from "../../design/TextInput";
import { FormError } from "./FormError";

const RegisterSchema = Yup.object({
  username: Yup.string()
    .email("You must use a valid email.")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Passwords must be longer than 8 characters.")
    .required("Must provide a password."),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match.")
    .required("Must confirm password by typing it again."),
});

export function Register() {
  const actions = Auth.useActions();

  React.useEffect(() => {
    actions.requestRegistration();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-2 p-8 w-full">
        <OAuthButton Logo={<Google />} onClick={actions.signInGoogle}>
          Sign Up with Google
        </OAuthButton>
        <OAuthButton Logo={<Apple />} onClick={actions.signInApple}>
          Sign Up with Apple
        </OAuthButton>
      </div>
      <div className="flex flex-nowrap items-center">
        <div className="border-b border-dark-gray-50 w-1/2" />
        <Text as="span" variant="label" color="text-gray-600" className="px-2">
          or
        </Text>
        <div className="border-b border-dark-gray-50 w-1/2" />
      </div>
      <Formik
        validationSchema={RegisterSchema}
        validateOnChange={false}
        onSubmit={async (params, { setFieldError }) => {
          try {
            const passOk = await meetsPasswordBreachRequirements(
              params.password
            );
            if (passOk) {
              await actions.signUp(params);
            } else {
              setFieldError(
                "password",
                "This password is known to be weak. You must choose a different password."
              );
            }
          } catch (err) {
            if (err instanceof Error) {
              setFieldError("username", err.message);
              return;
            } else {
              Sentry.captureException(err);
              setFieldError("username", "Unknown error. Try again.");
            }
          }
        }}
        initialValues={{
          username: "",
          password: "",
          confirm: "",
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="flex flex-col h-full px-8 pb-6 gap-y-4">
            <Field
              required
              id="registration-email-input"
              as={TextInput}
              type="email"
              name="username"
              label="Email"
              autoComplete="email"
              error={touched.username && Boolean(errors.username)}
              aria-errormessage="username-error"
            />
            <FormError id="username-error" name="username" />
            <Field
              required
              id="registration-password-input"
              as={PasswordInput}
              name="password"
              label="Password"
              autoComplete="new-password"
              error={touched.password && Boolean(errors.password)}
              aria-errormessage="password-error"
            />
            <FormError id="password-error" name="password" />
            <Field
              required
              id="registration-confirm-input"
              as={PasswordInput}
              name="confirm"
              label="Confirm Password"
              autoComplete="new-password"
              error={touched.confirm && Boolean(errors.confirm)}
              aria-errormessage="confirm-error"
            />
            <FormError id="confirm-error" name="confirm" />
            <div className="flex">
              <Text
                link
                as="button"
                type="button"
                variant="body-small"
                color="text-dark-gray-600"
                onClick={actions.requestVerification}
              >
                Have a registration verification code?
              </Text>
            </div>
            <div className="flex justify-between">
              <Button type="submit" disabled={isSubmitting}>
                Next
              </Button>
              <div className="flex items-center gap-x-2">
                <Text variant="body-small" color="text-dark-gray-600">
                  Already a member?
                </Text>
                <Button variant="tiny" onClick={actions.requestLogin}>
                  Sign In
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
