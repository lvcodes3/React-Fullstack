// dependencies
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
  createdAt: string;
  updatedAt: string;
  postId: number;
};

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState<PostObject>({} as PostObject);
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get post
        let response = await axios.get(`http://localhost:5000/posts/${id}`);
        if (response.status === 200) {
          //console.log(response.data);
          setPost(response.data);
        }
        // get comments associated to the post
        response = await axios.get(`http://localhost:5000/comments/${id}`);
        if (response.status === 200) {
          //console.log(response.data);
          setComments(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
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
            accessToken: sessionStorage.getItem("accessToken"),
          },
        }
      );

      console.log(response);

      if (response.status === 201) {
        // create the comment to add based on response
        const commentToAdd: CommentObject = {
          id: response.data.id,
          comment: response.data.comment,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
          postId: response.data.postId,
        };

        // append the created comment to the list of comments
        setComments([...comments, commentToAdd]);

        // reset the comment field
        setNewComment("");
      } else if (response.status === 401 || response.status === 500) {
        // show error
        alert(response.data.error);
        // reset the comment field
        setNewComment("");
      }
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 500) {
          alert(err.response.data.error);
        }
      }
    }
  };

  return (
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
            return (
              <div
                key={comment.id}
                className="border-2 border-blue-600 rounded-md p-5 mb-5"
              >
                {comment.comment}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Post;
