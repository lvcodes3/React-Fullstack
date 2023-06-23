// dependencies
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
// context
import { AuthContext } from "../helpers/AuthContext";
// react-icons
import { FaUser, FaThumbsUp, FaTrashAlt, FaComment } from "react-icons/fa";

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

type CommentObject = {
  id: number;
  comment: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  postId: number;
};

type ErrorResponse = {
  error: string;
};

const Post = () => {
  const { id } = useParams();

  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  // hooks
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<PostObject>({} as PostObject);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getPostResponse = await axios.get(
          `http://localhost:5000/posts/byId/${id}`,
          {
            headers: {
              jwt: localStorage.getItem("jwt"),
            },
          }
        );
        // console.log(getPostResponse);

        const getCommentsResponse = await axios.get(
          `http://localhost:5000/comments/${id}`,
          {
            headers: {
              jwt: localStorage.getItem("jwt"),
            },
          }
        );
        // console.log(getCommentsResponse);

        if (getPostResponse.status === 200) {
          setPost(getPostResponse.data.post);
          setLikedPosts(
            getPostResponse.data.likedPosts.map((like: LikedPostObject) => {
              return like.postId;
            })
          );
        }

        if (getCommentsResponse.status === 200) {
          setComments(getCommentsResponse.data);
        }

        setIsLoading(false);
      } catch (err: unknown) {
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
    if (authState.status) {
      fetchData();
    }
  }, [authState.status, id]);

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
      const updatedPost = { ...post };
      if (response.status === 201) {
        updatedPost.likes.push(0);
      } else if (response.status === 204) {
        updatedPost.likes.pop();
      }
      setPost(updatedPost);

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
      //console.log(response);

      if (response.status === 204) {
        // go to home page
        navigate(`/`);
      }
    } catch (err: unknown) {
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

  const addComment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/comments",
        {
          comment: newComment,
          postId: id,
        },
        {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        }
      );
      //console.log(response);

      // create the new comment to add
      const commentToAdd: CommentObject = {
        id: response.data.id,
        comment: response.data.comment,
        username: response.data.username,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        postId: response.data.postId,
      };

      // append the created comment to the list of comments
      setComments([...comments, commentToAdd]);

      // reset the comment field
      setNewComment("");
    } catch (err: unknown) {
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
          alert("No response recieved. Please check your internet connection.");
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

  const deleteComment = async (commentId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/comments/${commentId}`,
        {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        }
      );
      //console.log(response);

      if (response.status === 204) {
        // filter out the deleted comment
        setComments(
          comments.filter((comment) => {
            return comment.id !== commentId;
          })
        );
      }
    } catch (err) {
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
          alert("No response recieved. Please check your internet connection.");
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

  return (
    <>
      {/* CONDITIONALLY RENDERING CONTENT IF LOGGED IN OR NO CONTENT IF NOT LOGGED IN */}
      {authState.status ? (
        // ONLY LOAD CONTENT IF CONTENT IS AVAILABLE //
        isLoading ? (
          <div className="mt-10">
            <h1 className="text-center text-2xl font-bold">Loading...</h1>
          </div>
        ) : (
          <div className="flex mt-10 flex-col items-center md:flex-row md:items-start">
            <div className="w-4/4 md:w-2/4 h-80 border-2 border-blue-600 rounded-md md:ml-10">
              <div className="flex items-center justify-center h-1/4 bg-blue-600">
                <p className="text-center text-white">{post.title}</p>
              </div>
              <div className="flex items-center justify-center h-2/4">
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
                  <div className="mr-5">
                    <p className="text-white">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex mr-5">
                    <button
                      className="bg-white hover:bg-gray-200 py-1 px-2 rounded"
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
                    <p className="text-white ml-2">{post.likes.length}</p>
                  </div>

                  <div className="flex mr-5">
                    <div className="bg-white py-1 px-2 rounded">
                      <FaComment />
                    </div>
                    <p className="text-white ml-2">{comments.length}</p>
                  </div>

                  {/* CONDITIONALLY RENDERING DELETE POST BUTTON */}
                  {authState.username === post.username && (
                    <div className="flex mr-5">
                      <button
                        className="bg-white hover:bg-gray-200 py-1 px-2 rounded"
                        onClick={() => deletePost(post.id)}
                      >
                        <FaTrashAlt className="text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-4/4 mt-10 md:w-2/4 md:mt-0 md:px-10">
              <div className="flex flex-col pb-5">
                <input
                  id="commentInput"
                  className="h-12 border-2 border-blue-600 rounded-md"
                  type="text"
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                  }}
                  placeholder="Comment"
                  autoComplete="off"
                />
                <button
                  className="text-white bg-blue-600 border-2 border-blue-600 rounded-md p-2"
                  onClick={addComment}
                >
                  Add Comment
                </button>
              </div>
              <div>
                {comments.map((comment) => {
                  return authState.username === comment.username ? (
                    <div
                      key={comment.id}
                      className="border-2 border-blue-600 rounded-md p-5 mb-5"
                    >
                      <div className="flex">
                        <div>
                          <button
                            className="hover:bg-gray-200 py-1 px-1 rounded"
                            onClick={() => deleteComment(comment.id)}
                          >
                            <FaTrashAlt className="text-red-500" />
                          </button>
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <p className="text-right whitespace-normal">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                      <p className="text-right">- {comment.username}</p>
                    </div>
                  ) : (
                    <div
                      key={comment.id}
                      className="border-2 border-blue-600 rounded-md p-5 mb-5"
                    >
                      <p className="text-left">{comment.comment}</p>
                      <p className="text-left">- {comment.username}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center mt-10">
          Log in to view Post!
        </div>
      )}
    </>
  );
};
export default Post;
