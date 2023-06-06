// dependencies
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

type PostObject = {
  id: number;
  title: string;
  text: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

type ErrorResponse = {
  error: string;
};

const Home = () => {
  let navigate = useNavigate();
  const [posts, setPosts] = useState<PostObject[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts", {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        });
        //console.log(response);
        setPosts(response.data);
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
    getPosts();
  }, []);

  return (
    <div className="flex flex-col items-center mt-10">
      {posts.map((post) => {
        return (
          <div
            key={post.id}
            className="w-3/4 h-80 cursor-pointer border-2 border-blue-600 rounded-md mb-10"
            onClick={() => {
              navigate(`/post/${post.id}`);
            }}
          >
            <div className="flex items-center justify-center h-1/4 bg-blue-600">
              <p className="text-center text-white">{post.title}</p>
            </div>
            <div className="flex items-center justify-center h-2/4">
              <p className="text-center">{post.text}</p>
            </div>
            <div className="flex items-center h-1/4 bg-blue-600">
              <p className="text-left text-white ml-5">{post.username}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Home;
