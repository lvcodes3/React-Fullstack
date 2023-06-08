// dependencies
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
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
  const { authState } = useContext(AuthContext);
  const { id } = useParams();
  const [post, setPost] = useState<PostObject>({} as PostObject);
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts/${id}`, {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        });
        //console.log("GET POST RESPONSE:");
        //console.log(response);
        setPost(response.data);
      } catch (err: unknown) {
        console.log(err);
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

    const getComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/comments/${id}`,
          {
            headers: {
              jwt: localStorage.getItem("jwt"),
            },
          }
        );
        //console.log("GET COMMENTS RESPONSE:");
        //console.log(response);
        setComments(response.data);
      } catch (err: unknown) {
        console.log(err);
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

    getPost();
    getComments();
  }, [id]);

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
      //console.log("ADD COMMENT RESPONSE:");
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
      console.log(err);
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

      if (response.status === 204) {
        // filter out the deleted comment
        setComments(
          comments.filter((comment) => {
            return comment.id !== commentId;
          })
        );
      }
    } catch (err) {
      console.log(err);
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
      {authState.status ? (
        <div className="flex mt-10">
          <div className="w-2/4 h-80 border-2 border-blue-600 rounded-md ml-10">
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

          <div className="w-2/4 px-10">
            <div className="flex flex-col pb-5">
              <input
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
                    <p className="text-right">{comment.comment}</p>
                    <p className="text-right">
                      - {comment.username}{" "}
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-1 rounded"
                        onClick={() => deleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    </p>
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
      ) : (
        <div className="flex flex-col items-center mt-10">
          Log in to view Post!
        </div>
      )}
    </>
  );
};
export default Post;
