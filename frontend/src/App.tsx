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
// context
import { AuthContext } from "./helpers/AuthContext";

const App = () => {
  const [authState, setAuthState] = useState<boolean>(false);

  useEffect(() => {
    const validateJWT = async () => {
      try {
        // const response =
        await axios.get("http://localhost:5000/auth", {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        });
        //console.log(response);
        setAuthState(true);
      } catch (err: unknown) {
        console.log(err);

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
              alert(errorResponse.error);
              setAuthState(false);
            } else if (axiosError.response.status === 500) {
              alert(errorResponse.error);
              setAuthState(false);
            }
          }
          // axios error has a request
          else if (axiosError.request) {
            console.log(axiosError.request);
            alert(
              "No response recieved. Please check your internet connection."
            );
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
    validateJWT();
  }, []);

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
            {!authState ? (
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
                <p className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-5 rounded-md text-sm font-medium">
                  Logout
                </p>
              </div>
            )}
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
