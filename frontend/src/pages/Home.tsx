// dependencies
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
// context
import { AuthContext } from "../helpers/AuthContext";

type PostObject = {
  id: number;
  title: string;
  text: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

const Home = () => {
  const { authState } = useContext(AuthContext);
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
            } else if (axiosError.response.status === 500) {
              console.log(errorResponse.error);
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
    getPosts();
  }, []);

  return (
    <>
      {authState.status ? (
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
      ) : (
        <div className="flex flex-col items-center mt-10">
          Log in to see Posts!
        </div>
      )}
    </>
  );
};
export default Home;
