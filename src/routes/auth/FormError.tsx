import { ErrorMessage } from "formik";

import { Text } from "../../design/Text";

type Props = {
  name: string;
  id: string;
  className?: string;
};

/**
 * Wraps formik ErrorMessage for auth forms.
 */
export function FormError({ name, id, className }: Props) {
  return (
    <ErrorMessage name={name}>
      {(msg) => (
        <Text
          id={id}
          role="alert"
          variant="label"
          color="text-accent-red"
          className={className}
        >
          {msg}
        </Text>
      )}
    </ErrorMessage>
  );
}
