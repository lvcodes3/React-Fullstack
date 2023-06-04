// dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik"; // Formik helps with forms
import * as Yup from "yup"; // Yup helps with data form validation
import axios, { AxiosError } from "axios";

const Register = () => {
  let navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string>("");

  // initial values for the Formik form
  const intialValues = {
    username: "",
    password: "",
  };

  // using Yup to validate form data
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3)
      .max(15)
      .required("The Username is a required field!"),
    password: Yup.string()
      .min(4)
      .max(20)
      .required("The Password is a required field!"),
  });

  // sending validated data to the backend API
  const formSubmit = async (data: {}) => {
    try {
      const response = await axios.post<string>(
        "http://localhost:5000/auth/register",
        data
      );

      console.log(response);
      alert(response.data);

      // go to login page
      navigate("/login");
    } catch (err: any) {
      console.log(err);

      type ErrorResponse = {
        error: string;
      };

      // error is an Axios Error
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;

        // axios error has a response
        if (axiosError.response) {
          const errorResponse = axiosError.response.data as ErrorResponse;
          if (axiosError.response.status === 401) {
            setRegisterError(errorResponse.error);
          } else if (axiosError.response.status === 500) {
            alert(errorResponse.error);
          }
        }
        // axios error has a request
        else if (axiosError.request) {
          console.log(axiosError.request);
          alert("No response recieved. Please check your internet connection.");
        }
        // axios error has a message
        else {
          console.log("Error", axiosError.message);
          alert("An error occurred. Please try again.");
        }
      }
      // unknown error
      else {
        console.log("Error", err.message);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Formik
        initialValues={intialValues}
        validationSchema={validationSchema}
        onSubmit={formSubmit}
      >
        <Form className="w-3/4 p-6 border-2 border-blue-600 rounded-md">
          {registerError && (
            <p className="block mb-2 font-bold text-red-500">{registerError}</p>
          )}
          <label className="block mb-2 font-bold">Username:</label>
          <ErrorMessage
            name="username"
            className="text-red-500"
            component="span"
          />
          <Field
            name="username"
            className="w-full p-2 mb-4 border-2 border-blue-600 rounded-md"
            placeholder="Username"
            autoComplete="off"
          />

          <label className="block mb-2 font-bold">Password:</label>
          <ErrorMessage
            name="password"
            className="text-red-500"
            component="span"
          />
          <Field
            type="password"
            name="password"
            className="w-full p-2 mb-4 border-2 border-blue-600 rounded-md"
            placeholder="Password"
            autoComplete="off"
          />

          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-600 rounded-md"
          >
            Register
          </button>
        </Form>
      </Formik>
    </div>
  );
};
export default Register;
