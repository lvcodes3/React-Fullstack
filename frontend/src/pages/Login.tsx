// dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  let navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // sending validated data to the backend API
  const formSubmit = async (e: any) => {
    try {
      // prevent screen refresh
      e.preventDefault();

      const data = {
        username,
        password,
      };

      const response = await axios.post(
        "http://localhost:5000/auth/login",
        data
      );

      console.log(response);

      // alert any error response from the backend
      if (response.data.error) {
        alert(response.data.error);
      } else {
        // save the JWT in the session storage
        sessionStorage.setItem("accessToken", response.data);
        // go to home page
        navigate("/");
      }
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        if (err.response.status === 401) {
          alert("Unauthorized: Please check your credentials");
        } else if (err.response.status === 500) {
          alert("Internal Server Error: Failed to login user");
        } else {
          alert("An error occurred. Please try again.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        // `err.request` is an instance of XMLHttpRequest in the browser
        console.log(err.request);
        alert("No response received. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
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
        <label className="block mb-2 font-bold">Username:</label>
        <input
          name="username"
          className="w-full p-2 mb-4 border-2 border-blue-600 rounded-md"
          placeholder="Username"
          autoComplete="off"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
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
