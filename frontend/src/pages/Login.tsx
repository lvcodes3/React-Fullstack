// dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const Login = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  // sending validated data to the backend API
  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      // prevent screen refresh
      e.preventDefault();

      const data = {
        username,
        password,
      };

      const response = await axios.post<string>(
        "http://localhost:5000/auth/login",
        data
      );

      console.log(response);

      // save the JWT in the session storage
      sessionStorage.setItem("accessToken", response.data);

      // go to home page
      navigate("/");
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
            setLoginError(errorResponse.error);
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
      <form
        className="w-3/4 p-6 border-2 border-blue-600 rounded-md"
        onSubmit={formSubmit}
      >
        {loginError && (
          <p className="block mb-2 font-bold text-red-500">{loginError}</p>
        )}
        <label className="block mb-2 font-bold">Username:</label>
        <input
          name="username"
          className="w-full p-2 mb-4 border-2 border-blue-600 rounded-md"
          placeholder="Username"
          autoComplete="off"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          required
        />

        <label className="block mb-2 font-bold">Password:</label>
        <input
          type="password"
          name="password"
          className="w-full p-2 mb-4 border-2 border-blue-600 rounded-md"
          placeholder="Password"
          autoComplete="off"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />

        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-600 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
