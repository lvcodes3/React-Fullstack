import React, { useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts");
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return <div className="App"></div>;
}

export default App;
