import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Google, Apple } from "../../components/SocialIcons";
import { OAuthButton } from "../../design/Button";
import { TextInput } from "../../design/TextInput";

import * as Cognito from "../../providers/cognito";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInApple, signInGoogle } = Cognito.useCognito();

  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: true,
    onSubmit: async ({ email, password }) => {
      try {
        setSubmitting(true);

        const user = await signIn(email, password);

        if (user) {
          navigate(`/dashboard`);
        }
      } catch (error: any) {
        // setError(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-2 p-8 w-full">
        <OAuthButton Logo={<Google />}>Sign Up with Google</OAuthButton>
        <OAuthButton Logo={<Apple />}>Sign Up with Apple</OAuthButton>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <TextInput
          id="emailinput"
          label="email"
          name="email"
          placeholder="hello@clouty.io"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={formik.handleChange}
          value={formik.values.password}
          className="w-full mt-4"
        />
      </form>
    </div>
  );
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
  password: Yup.string().min(6).required("Required"),
});
