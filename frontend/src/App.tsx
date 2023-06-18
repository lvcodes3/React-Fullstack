// dependencies
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
// pages
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
// context
import { AuthContext } from "./helpers/AuthContext";
// react-icons
import { FaUser } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa";

const App = () => {
  type AuthStateType = {
    id: number;
    username: string;
    status: boolean;
  };
  const initialAuthState: AuthStateType = {
    id: 0,
    username: "",
    status: false,
  };
  const [authState, setAuthState] = useState<AuthStateType>(initialAuthState);

  useEffect(() => {
    const validateJWT = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth", {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        });
        //console.log(response);
        setAuthState((prevState) => ({
          ...prevState,
          id: response.data.id,
          username: response.data.username,
          status: true,
        }));
      } catch (err: unknown) {
        //console.log(err);

        type ErrorResponse = {
          error: string;
        };

        // Axios Error
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ErrorResponse>;

          // axios error has a response
          if (axiosError.response) {
            const errorResponse = axiosError.response.data as ErrorResponse;
            if (axiosError.response.status === 403) {
              console.log(errorResponse.error);
              setAuthState((prevState) => ({
                ...prevState,
                status: false,
              }));
            } else if (axiosError.response.status === 500) {
              console.log(errorResponse.error);
              setAuthState((prevState) => ({
                ...prevState,
                status: false,
              }));
            }
          }
          // axios error has a request
          else if (axiosError.request) {
            console.log(axiosError.request);
            console.log(
              "No response recieved. Please check your internet connection."
            );
          }
          // axios error has a message
          else {
            console.log("Error", axiosError.message);
            console.log("An error occurred. Please try again.");
          }
        }
        // Unknown Error
        else {
          console.log("Error", err);
          console.log("An error occurred. Please try again.");
        }
      }
    };
    validateJWT();
  }, []);

  const logout = () => {
    localStorage.removeItem("jwt");
    setAuthState(initialAuthState);
  };

  const userProfileLink = `/profile/${authState.id}`;

  return (
    <div>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <nav className="h-16 bg-blue-600 flex justify-between">
            <div className="flex items-center">
              <Link
                to="/"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-5 rounded-md text-sm font-medium"
              >
                Home Page
              </Link>
              <Link
                to="/createPost"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-5 rounded-md text-sm font-medium"
              >
                Create a Post
              </Link>
            </div>
            {!authState.status ? (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-5 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-5 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  to={userProfileLink}
                  className="flex items-center bg-white hover:bg-gray-200 text-black font-bold py-1 px-3 rounded"
                >
                  {authState.username}
                  <FaUser className="ml-1" />
                </Link>
                <button
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 mx-5 rounded"
                  onClick={logout}
                >
                  Logout
                  <FaPowerOff className="ml-1" />
                </button>
              </div>
            )}
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
