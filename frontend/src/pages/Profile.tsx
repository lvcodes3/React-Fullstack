// dependencies
import { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
// context
import { AuthContext } from "../helpers/AuthContext";
// react-icons
import { FaUser, FaThumbsUp, FaTrashAlt } from "react-icons/fa";

type PostObject = {
  id: number;
  title: string;
  text: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
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

const Profile = () => {
  const { id } = useParams();

  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  // hooks associated with the id
  const [username, setUsername] = useState<string>("");
  const [posts, setPosts] = useState<PostObject[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/auth/info/${id}`
        );
        //console.log(response);
        if (response.status === 200) {
          setUsername(response.data.username);
        }
      } catch (err: unknown) {
        //console.log(err);
        // Axios Error
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ErrorResponse>;

          // axios error has a response
          if (axiosError.response) {
            const errorResponse = axiosError.response.data as ErrorResponse;
            console.log(errorResponse.error);
            if (axiosError.response.status === 404) {
              console.log("User does not exist.");
              navigate("/notfound");
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
    const getUserPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/posts/byUserId/${id}`,
          {
            headers: {
              jwt: localStorage.getItem("jwt"),
            },
          }
        );
        //console.log(response);
        if (response.status === 200) {
          setPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like: LikedPostObject) => {
              return like.postId;
            })
          );
        }
      } catch (err: unknown) {
        console.log(err);
        // Axios Error
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ErrorResponse>;

          // axios error has a response
          if (axiosError.response) {
            const errorResponse = axiosError.response.data as ErrorResponse;
            console.log(errorResponse.error);
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
    getUserInfo();
    getUserPosts();
  }, [id, navigate]);

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
      // update post likes for the frontend display
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

  const deletePost = async (postId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/posts/${postId}`,
        {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        }
      );
      if (response.status === 204) {
        // filter out the deleted post
        setPosts(
          posts.filter((post) => {
            return post.id !== postId;
          })
        );
      }
    } catch (err: unknown) {
      //console.log(err);

      // Axios Error
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;

        // axios error has a response
        if (axiosError.response) {
          const errorResponse = axiosError.response.data as ErrorResponse;
          console.log(errorResponse.error);
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
      {/* CONDITIONALLY RENDERING CONTENT IF LOGGED IN OR NO CONTENT IF NOT LOGGED IN */}
      {authState.status ? (
        <div className="mt-10">
          <div>
            <h1 className="text-center text-2xl font-bold mb-2">
              {/* DYNAMIC HEADER */}
              {authState.username === username
                ? `Welcome to your profile, ${authState.username}!`
                : `Welcome to ${username}'s Profile!`}
            </h1>
          </div>
          <div>
            {/* CONDITIONALLY RENDERING CONTENT BASED ON IF USER HAS NO POSTS OR AT LEAST 1 POST */}
            {posts.length === 0 ? (
              <div>
                <h1 className="text-center text-xl font-bold">
                  {/* DYNAMIC HEADER */}
                  {authState.username === username
                    ? "You currently do not own any posts."
                    : `${username} does not currently own any posts.`}
                </h1>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h1 className="text-center text-xl font-bold mb-2">
                  {/* DYNAMIC HEADER */}
                  {authState.username === username
                    ? "Your Posts:"
                    : `${username}'s Posts:`}
                </h1>
                {/* DYNAMICALLY RENDERING POSTS */}
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
                        <button
                          className="flex items-center bg-white hover:bg-gray-200 text-black font-bold py-1 px-2 rounded ml-5"
                          onClick={() => {
                            navigate(`/profile/${post.userId}`);
                          }}
                        >
                          {post.username}
                          <FaUser className="ml-1" />
                        </button>
                        <div className="flex">
                          {/* CONDITIONALLY RENDERING DELETE POST BUTTON */}
                          {authState.username === post.username && (
                            <button
                              className="bg-white hover:bg-gray-200 py-1 px-2 mr-1 rounded"
                              onClick={() => deletePost(post.id)}
                            >
                              <FaTrashAlt className="text-red-500" />
                            </button>
                          )}
                          <button
                            className="bg-white hover:bg-gray-200 py-1 px-2 mr-1 rounded"
                            onClick={() => likePost(post.id)}
                          >
                            {/* CONDITIONALLY RENDERING BLUE LIKE BTN IF LIKED, GREY IF NOT LIKED */}
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
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <h1 className="text-center">Log in to view profile!</h1>
        </div>
      )}
    </>
  );
};
export default Profile;
