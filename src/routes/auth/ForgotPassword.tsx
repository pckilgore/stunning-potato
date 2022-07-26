import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { Button } from "../../design/Button";
import { Text } from "../../design/Text";
import { TextInput } from "../../design/TextInput";
import { TwoToneHeading } from "../../components/TwoToneHeading";
import { FormError } from "./FormError";

import * as Auth from "../../providers/auth";
import type { CognitoError } from "../../utils/authentication";

const ForgotPasswordSchema = Yup.object().shape({
  username: Yup.string().email().required("Required"),
});

export function ForgotPassword() {
  const { forgotPassword } = Auth.useActions();

  return (
    <div className="max-w-lg p-8 bg-dark-background-100">
      <div className="flex flex-wrap">
        <Text as="h1" variant="h3">
          <TwoToneHeading
            primary="Enter your email to"
            secondary="recover your password"
          />
        </Text>
        <Text variant="body-small" color="text-dark-gray-600" className="py-4">
          Verification code for reseting password will be send to your Email
        </Text>
      </div>
      <Formik
        validationSchema={ForgotPasswordSchema}
        initialValues={{
          username: "",
        }}
        onSubmit={async (params, { setFieldError }) => {
          try {
            await forgotPassword(params);
          } catch (err) {
            if (!(err instanceof Error)) {
              return;
            }

            if ((err as CognitoError).code === "UserNotFoundException") {
              setFieldError(
                "username",
                "Must provide a valid user. Check for typos and try again."
              );
              return;
            }

            setFieldError("username", err.message);
          }
        }}
      >
        {() => (
          <Form className="flex flex-col gap-y-4">
            <Field
              as={TextInput}
              id="forgot-input"
              label="Email"
              aria-errormessage="forgot-err"
              name="username"
            />
            <FormError id="forgot-err" name="username" />
            <div className="pt-6">
              <Button type="submit">Send Code</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
