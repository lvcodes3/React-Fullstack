// dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

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

      if (response.status === 200) {
        // save the JWT in the session storage
        sessionStorage.setItem("accessToken", response.data);
        // go to home page
        navigate("/");
      } else if (response.status === 401) {
        setLoginError(response.data.error);
      } else if (response.status === 500) {
        alert(response.data.error);
      }
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        if (err.response.status === 401) {
          setLoginError(err.response.data.error);
        } else if (err.response.status === 500) {
          alert(err.response.data.error);
        }
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
