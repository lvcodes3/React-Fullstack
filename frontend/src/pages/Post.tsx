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

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState<PostObject>({} as PostObject);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts/${id}`);
        if (response.status === 200) {
          setPost(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex mt-10">
      <div className="w-2/4 h-80 border-2 border-blue-600 rounded-md">
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
      <div className="w-2/4 h-80 border-2 border-blue-600 rounded-md">
        <p className="text-center">Comment Section</p>
      </div>
    </div>
  );
};
export default Post;
