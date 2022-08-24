import * as Yup from "yup";
import { Formik, Form, Field } from "formik";

import * as Auth from "../../providers/auth";

import { Button } from "../../design/Button";
import { Text } from "../../design/Text";
import { TextInput } from "../../design/TextInput";
import { NumberInput } from "../../design/NumberInput";
import { FormError } from "./FormError";

import { getMinBirthdate } from "../../models/Profile";

export const ProfileSchema = Yup.object({
  firstName: Yup.string().required("Must profile first name."),
  lastName: Yup.string().required("Must provide last name."),
  dob: Yup.object({
    day: Yup.number()
      .typeError("Not a number")
      .min(1, "Not a day")
      .max(31, "Not a day")
      .required("Required"),
    month: Yup.number()
      .typeError("Not a number")
      .min(1, "Not a month")
      .max(12, "Not a month")
      .required("Required"),
    year: Yup.number()
      .typeError("Not a number")
      .min(1900, "Too old. Typo?")
      .required("Required"),
  }),
});

export function RegisterProfile() {
  const { state, actions } = Auth.useAuth();

  return (
    <Formik
      validationSchema={ProfileSchema}
      validateOnChange={false}
      onSubmit={async (params, { setFieldError }) => {
        const { day, month, year } = params.dob;
        const birthdate = new Date(`${year}-${month}-${day}`);
        if (birthdate > getMinBirthdate()) {
          setFieldError("dob.year", "You must be 18+ to use app");
          return;
        }

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
        dob: {
          month: "",
          day: "",
          year: "",
        },
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
          <fieldset className="grid grid-cols-12 gap-x-2">
            <div className="col-start-1 col-end-4">
              <Field
                required
                id="registration-dob-day"
                as={NumberInput}
                name="dob.day"
                label="DD"
                min={1}
                max={31}
                error={touched.dob?.day && Boolean(errors.dob?.day)}
                aria-errormessage="dob-error-d"
                title="Day you were born"
                widget={false}
              />
            </div>
            <div className="col-start-4 col-end-7">
              <Field
                required
                id="registration-dob-month"
                aria-errormessage="dob-error-m"
                as={NumberInput}
                name="dob.month"
                label="MM"
                error={touched.dob?.month && Boolean(errors.dob?.month)}
                title="Month you were born"
                widget={false}
              />
            </div>
            <div className="col-start-7 col-end-13">
              <Field
                required
                id="registration-dob-day"
                as={NumberInput}
                name="dob.year"
                label="YYYY"
                min={1900}
                max={getMinBirthdate().getFullYear()}
                error={touched.dob?.year && Boolean(errors.dob?.year)}
                aria-errormessage="dob-error-y"
                title="Year you were born"
              />
            </div>
          </fieldset>
          <div className="grid grid-cols-12 gap-x-2">
            <FormError
              id="dob-error-d"
              name="dob.day"
              className="col-start-1 col-end-4"
            />
            <FormError
              id="dob-error-m"
              name="dob.month"
              className="col-start-4 col-end-7"
            />
            <FormError
              id="dob-error-y"
              name="dob.year"
              className="col-start-7 col-end-13"
            />
          </div>
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
