import React from "react";
import * as Sentry from "@sentry/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { Google, Apple } from "../../components/SocialIcons";
import { OAuthButton } from "../../design/Button";
import { TextInput } from "../../design/TextInput";
import { PasswordInput } from "../../design/PasswordInput";
import { Button } from "../../design/Button";
import { Text } from "../../design/Text";
import { FormError } from "./FormError";

import * as Auth from "../../providers/auth";

const LoginSchema = Yup.object().shape({
  username: Yup.string().email().required("Required"),
  password: Yup.string().min(6).required("Required"),
});

export function Login() {
  const actions = Auth.useActions();

  React.useEffect(() => {
    actions.requestLogin();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-2 p-8 w-full">
        <OAuthButton Logo={<Google />} onClick={actions.signInGoogle}>
          Sign In with Google
        </OAuthButton>
        <OAuthButton Logo={<Apple />} onClick={actions.signInApple}>
          Sign In with Apple
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
        validationSchema={LoginSchema}
        onSubmit={async (params, { setFieldError }) => {
          try {
            await actions.signIn(params);
          } catch (err) {
            const msg =
              (err as Error)?.message ?? "Unknown error, please try again.";
            setFieldError("username", msg);
            Sentry.captureException(err);
          }
        }}
        initialValues={{
          username: "",
          password: "",
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="flex flex-col px-8 pb-6 gap-y-4">
            <Field
              as={TextInput}
              id="login-email"
              label="Email"
              name="username"
              autoComplete="username"
              aria-errormessage="login-err"
              error={touched.username && Boolean(errors.username)}
            />
            <FormError name="username" id="login-err" />
            <Field
              as={PasswordInput}
              id="login-password"
              name="password"
              label="Password"
              autoComplete="current-password"
              error={touched.password && Boolean(errors.password)}
            />
            <div className="flex">
              <Text
                link
                as="button"
                type="button"
                variant="body-small"
                color="text-dark-gray-600"
                onClick={actions.requestForgotPassword}
              >
                Forgot your password?
              </Text>
            </div>
            <div className="flex justify-between items-center pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                working={isSubmitting}
              >
                Sign In
              </Button>
              <div className="flex gap-x-2 items-center">
                <Text
                  as="label"
                  variant="body-small"
                  color="text-dark-gray-600"
                >
                  New to app?
                </Text>
                <Button variant="tiny" onClick={actions.requestRegistration}>
                  Sign Up
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
