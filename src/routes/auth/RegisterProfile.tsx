import { Formik, Form, Field } from "formik";

import * as Auth from "../../providers/auth";

import { Button } from "../../design/Button";
import { Text } from "../../design/Text";
import { TextInput } from "../../design/TextInput";
import { DateInput } from "../../design/DateInput";
import { FormError } from "./FormError";

import { ProfileSchema } from "../../models/Profile";

export function RegisterProfile() {
  const { state, actions } = Auth.useAuth();

  return (
    <Formik
      validationSchema={ProfileSchema}
      validateOnChange={false}
      onSubmit={async (params) => {
        // Placeholder for real profile logic
        if (state?.context?.user?.sub) {
          window.localStorage.setItem(
            state?.context?.user?.sub,
            JSON.stringify(params)
          );
          actions.onboarding.start();
        }
      }}
      initialValues={{
        firstName: "",
        lastName: "",
        birthDate: "",
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="flex flex-col h-full p-8 gap-y-4">
          <Field
            required
            id="profile-first-input"
            as={TextInput}
            name="firstName"
            label="First name"
            error={touched.lastName && Boolean(errors.firstName)}
            aria-errormessage="first-error"
          />
          <FormError id="first-error" name="firstName" />
          <Field
            required
            id="profile-last-input"
            as={TextInput}
            name="lastName"
            label="Last name"
            error={touched.lastName && Boolean(errors.lastName)}
            aria-errormessage="last-error"
          />
          <FormError id="last-error" name="lastName" />
          <Field
            required
            id="registration-confirm-input"
            as={DateInput}
            name="birthDate"
            label="Date of Birth"
            error={touched.birthDate && Boolean(errors.birthDate)}
            aria-errormessage="dob-error"
          />
          <FormError id="dob-error" name="birthDate" />
          <div className="flex gap-x-4 items-center">
            <div className="shrink-0">
              <Button type="submit" disabled={isSubmitting}>
                Sign Up
              </Button>
            </div>
            <Text variant="label" color="text-dark-gray-600">
              By signing up, you agree to the
              <br /> <b>Terms of Service</b> and <b>Privacy Policy</b>
            </Text>
          </div>
        </Form>
      )}
    </Formik>
  );
}
