// dependencies
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// pages
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <div>
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
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
