// dependencies
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
// context
import { AuthContext } from "../helpers/AuthContext";
// react-icons
import { FaThumbsUp } from "react-icons/fa";

type PostObject = {
  id: number;
  title: string;
  text: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  likes: Array<{}>;
};

type LikedPostObject = {
  id: number;
  createdAt: string;
  updatedAt: string;
  postId: number;
  userId: number;
};

type ErrorResponse = {
  error: string;
};

const Home = () => {
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();
  const [posts, setPosts] = useState<PostObject[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts", {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        });
        //console.log(response);
        setPosts(response.data.listOfPosts);
        setLikedPosts(
          response.data.likedPosts.map((like: LikedPostObject) => {
            return like.postId;
          })
        );
      } catch (err: unknown) {
        //console.log(err);

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
    // only get posts if logged in
    if (authState.status) {
      getPosts();
    }
  }, [authState.status]);

  const likePost = async (postId: number) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/likes",
        {
          postId: postId,
        },
        {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        }
      );
      //console.log(response);
      // update likes for the frontend display
      const postIndex = posts.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        const updatedPosts = [...posts];
        if (response.status === 201) {
          updatedPosts[postIndex].likes.push(0);
        } else if (response.status === 204) {
          updatedPosts[postIndex].likes.pop();
        }
        setPosts(updatedPosts);
      }
      // update likes
      if (likedPosts.includes(postId)) {
        setLikedPosts(
          likedPosts.filter((id) => {
            return id !== postId;
          })
        );
      } else {
        setLikedPosts([...likedPosts, postId]);
      }
    } catch (err: unknown) {
      //console.log(err);

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

  return (
    <>
      {authState.status ? (
        <div className="flex flex-col items-center mt-10">
          {posts.map((post) => {
            return (
              <div
                key={post.id}
                className="w-3/4 h-80 border-2 border-blue-600 rounded-md mb-10"
              >
                <div className="flex items-center justify-center h-1/4 bg-blue-600">
                  <p className="text-center text-white">{post.title}</p>
                </div>
                <div
                  className="flex items-center justify-center h-2/4 cursor-pointer"
                  onClick={() => {
                    navigate(`/post/${post.id}`);
                  }}
                >
                  <p className="text-center">{post.text}</p>
                </div>
                <div className="flex justify-between items-center h-1/4 bg-blue-600">
                  <p className="text-white ml-5">- {post.username}</p>
                  <div className="flex">
                    <button
                      className="bg-white hover:bg-gray-200 font-bold py-1 px-2 mr-1 rounded"
                      onClick={() => likePost(post.id)}
                    >
                      <FaThumbsUp
                        className={
                          likedPosts.includes(post.id)
                            ? "text-blue-500"
                            : "text-gray-500"
                        }
                      />
                    </button>
                    <p className="text-white mr-5">{post.likes.length}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10">
          Log in to view Posts!
        </div>
      )}
    </>
  );
};
export default Home;
