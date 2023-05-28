// dependencies
import { useState, useEffect } from "react";
import axios from "axios";

type PostObject = {
  id: number;
  title: string;
  text: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

const Home = () => {
  const [posts, setPosts] = useState<PostObject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts");
        if (response.status === 200) {
          setPosts(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {posts.map((post) => {
        return (
          <div
            className="w-3/4 h-80 border-2 border-blue-600 rounded-md my-5"
            key={post.id}
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
