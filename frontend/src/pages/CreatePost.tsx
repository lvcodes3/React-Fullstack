// dependencies
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik"; // Formik helps with forms
import * as Yup from "yup"; // Yup helps with data form validation
import axios, { AxiosError } from "axios";

type ErrorResponse = {
  error: string;
};

const CreatePost = () => {
  let navigate = useNavigate();

  // initial values for the Formik form
  const intialValues = {
    title: "",
    text: "",
    username: "",
  };

  // using Yup to validate form data
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("The Title is a required field!"),
    text: Yup.string().required("The Post is a required field!"),
    username: Yup.string()
      .min(3)
      .max(15)
      .required("The Username is a required field!"),
  });

  // sending validated data to the backend API
  const formSubmit = async (data: {}) => {
    try {
      await axios.post("http://localhost:5000/posts", data, {
        headers: {
          jwt: sessionStorage.getItem("jwt"),
        },
      });
      navigate("/");
    } catch (err: unknown) {
      console.log(err);
      // Axios Error
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;

        // axios error has a response
        if (axiosError.response) {
          const errorResponse = axiosError.response.data as ErrorResponse;
          if (axiosError.response.status === 403) {
            alert(errorResponse.error);
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
      // Unknown Error
      else {
        console.log("Error", err);
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
          <label className="block mb-2 font-bold">Title:</label>
          <ErrorMessage
            name="title"
            className="text-red-500"
            component="span"
          />
          <Field
            name="title"
            className="w-full p-2 mb-4 border-2 border-blue-600 rounded-md"
            placeholder="Title"
            autoComplete="off"
          />

          <label className="block mb-2 font-bold">Post:</label>
          <ErrorMessage name="text" className="text-red-500" component="span" />
          <Field
            name="text"
            className="w-full p-2 mb-4 border-2 border-blue-600 rounded-md"
            placeholder="Post"
            autoComplete="off"
          />

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

          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-600 rounded-md"
          >
            Create Post
          </button>
        </Form>
      </Formik>
    </div>
  );
};
export default CreatePost;
