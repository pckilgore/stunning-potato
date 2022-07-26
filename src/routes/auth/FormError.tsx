import { ErrorMessage } from "formik";

import { Text } from "../../design/Text";

/**
 * Wraps formik ErrorMessage for auth forms.
 */
export function FormError({ name, id }: { name: string; id: string }) {
  return (
    <ErrorMessage name={name}>
      {(msg) => (
        <Text id={id} role="alert" variant="label" color="text-accent-red">
          {msg}
        </Text>
      )}
    </ErrorMessage>
  );
}
