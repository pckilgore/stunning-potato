import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import * as Auth from "../../providers/auth";
import { Text } from "../../design/Text";
import { TextInput } from "../../design/TextInput";
import { Button } from "../../design/Button";
import { FormError } from "./FormError";

import type { CognitoError } from "../../utils/authentication";

const VerifySchema = Yup.object().shape({
  username: Yup.string()
    .email()
    .required(
      "You must provide a username for verification or to resend code."
    ),
  code: Yup.string()
    .required()
    .length(6)
    .matches(/^[\d]{6}$/, "numbers only"),
});

export function RegisterVerify() {
  const { actions, state } = Auth.useAuth();
  const [resendMsg, setResendMsg] = React.useState("");
  const navigate = useNavigate();

  const username = state.context.verificationUsername ?? "";

  return (
    <Formik
      data-testid="verify-container"
      validationSchema={VerifySchema}
      onSubmit={async (params, { setFieldError }) => {
        try {
          await actions.verify(params);
        } catch (err) {
          if (!(err instanceof Error)) {
            return;
          }

          if ((err as CognitoError).code === "CodeMismatchException") {
            setFieldError(
              "code",
              "Code does not match. Check carefully and try again."
            );
          }

          if ((err as CognitoError).code === "NotAuthorizedException") {
            setFieldError(
              "username",
              "You've already confirmed! Go back to login."
            );
          }
        }
      }}
      initialValues={{
        username,
        code: "",
      }}
    >
      {({ errors, validateField, touched, values, setFieldError }) => (
        <Form className="bg-dark-background-200">
          <div className="flex flex-col pt-8 px-8 gap-y-4 pb-6">
            <Text as="h1" variant="h4" color="text-dark-gray-700">
              Enter the verification code here
            </Text>
            <Text variant="body-small" color="text-dark-gray-600">
              {username ? (
                <>
                  Verification code has been sent to <b>{username}</b> <br />
                </>
              ) : null}
              If you don't see the email, please check your spam folder.
            </Text>
            {username === "" ? (
              <>
                <Field
                  as={TextInput}
                  id="verification-username"
                  aria-errormessage="username-error"
                  label="Email"
                  name="username"
                  error={touched.username && Boolean(errors.username)}
                />
                <FormError id="username-error" name="username" />
              </>
            ) : (
              <Field type="hidden" name="username" />
            )}
            <Field
              as={TextInput}
              id="forgot-reset-code"
              label="Verification Code"
              aria-errormessage="code-error"
              name="code"
              maxLength="6"
              inputClass="tracking-[0.25em] font-semibold"
              error={touched.code && Boolean(errors.code)}
            />
            <FormError id="code-error" name="code" />
            <div className="flex gap-x-2 items-center">
              <Text as="label" variant="body-small" color="text-dark-gray-600">
                Did not get the email?
              </Text>
              <Button
                variant="tiny"
                onClick={async () => {
                  validateField("username");
                  if (errors.username) {
                    return;
                  }

                  try {
                    await actions.resendSignUp({ username: values.username });
                    setResendMsg(`Verification sent.`);
                  } catch {
                    setFieldError(
                      "username",
                      "Could not resend verification. Check entered email and try again."
                    );
                  }
                }}
              >
                Send again
              </Button>
            </div>
            {resendMsg ? (
              <Text variant="label" color="text-accent-green">
                {resendMsg}
              </Text>
            ) : null}
          </div>
          <div className="flex bg-dark-background-100 gap-x-2 px-8 py-6">
            <Button variant="icon" onClick={() => navigate(-1)}>{`<--`}</Button>
            <Button type="submit">Verify email</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
