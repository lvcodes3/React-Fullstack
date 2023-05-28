// dependencies
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// pages
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Link to="/createPost">Create a Post</Link>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createPost" element={<CreatePost />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
