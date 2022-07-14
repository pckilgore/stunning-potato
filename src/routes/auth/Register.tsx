import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";

import * as Cognito from "../../providers/cognito";

export default function Register() {
  const navigate = useNavigate();
  const { signUp, signInApple, signInGoogle } = Cognito.useCognito();

  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: RegisterSchema,
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: true,
    onSubmit: async ({ email, password }) => {
      try {
        setSubmitting(true);

        const user = await signUp(email, password);

        if (user) {
          navigate(`/verify?username=${user.user.username}`);
        }
      } catch (error: any) {
        // setError(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className="flex w-full justify-center mt-10 pb-20"
      data-testid="register-container"
    >
      <div className="flex flex-col md:w-1/2 w-full">
        <div className="flex flex-col mb-2 items-center">
          <h2>Register</h2>
        </div>
        <div className="mt-6">
          <button
            className="w-full"
            disabled={submitting}
            type="submit"
            onClick={signInGoogle}
          >
            Register with Google
          </button>
          <button
            className="w-full"
            disabled={submitting}
            type="submit"
            onClick={signInApple}
          >
            Register with Apple
          </button>
        </div>
        <div className="flex w-full items-center justify-between my-4">
          <div className="border-b border-mono-gray border-opacity-20 w-2/5" />
          <p className="forms text-mono-black text-opacity-20">OR</p>
          <div className="border-b border-mono-gray border-opacity-20 w-2/5" />
        </div>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="hello@clouty.io"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-full mt-4"
          />
          <div className="flex lg:flex-row flex-col justify-between lg:mt-6 mt-4 lg:items-center">
            <button>register</button>
            <div className="flex lg:mt-0 md:mt-3 md:justify-start mt-6 justify-center">
              <p className="text-sm">
                Already have an account?{" "}
                <Link className="cursor-pointer" to="/login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
  password: Yup.string().min(6).required("Required"),
});