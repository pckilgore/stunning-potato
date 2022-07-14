import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSearchParams, useNavigate } from "react-router-dom";

import * as Cognito from "../../providers/cognito";

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verify } = Cognito.useCognito();

  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: VerifySchema,
    onSubmit: async ({ code }) => {
      try {
        setSubmitting(true);

        const username = searchParams.get("username");
        if (username) {
          const response = await verify(username, code);

          if (response) {
            return navigate(`/dashboard`);
          }
        }

        throw new Error("Invalid authentication code");
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
      data-testid="verify-container"
    >
      <div className="flex flex-col md:w-1/2 w-full">
        <div className="flex flex-col mb-2 items-center">
          <h2>Verify</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            name="code"
            placeholder="123456"
            onChange={formik.handleChange}
            value={formik.values.code}
            className="w-full"
          />
          <div className="flex lg:flex-row flex-col justify-between lg:mt-6 mt-4 lg:items-center">
            <button disabled={submitting}>verify</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const VerifySchema = Yup.object().shape({
  code: Yup.string().min(6).max(6).required("Required"),
});
