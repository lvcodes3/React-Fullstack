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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get post
        let response = await axios.get(`http://localhost:5000/posts/${id}`);
        if (response.status === 200) {
          console.log(response.data);
          setPost(response.data);
        }
        // get comments associated to the post
        response = await axios.get(`http://localhost:5000/comments/${id}`);
        if (response.status === 200) {
          console.log(response.data);
          setComments(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

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
            placeholder="Comment"
            autoComplete="off"
          />
          <button className="text-white bg-blue-600 border-2 border-blue-600 rounded-md p-2">
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
