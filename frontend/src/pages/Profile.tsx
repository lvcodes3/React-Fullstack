// dependencies
import { useEffect, useContext, useState } from "react";
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
  userId: number;
};

type ErrorResponse = {
  error: string;
};

const Profile = () => {
  // using authState.status to ensure user is logged-in in order to view page
  const { authState } = useContext(AuthContext);
  // getting id from url
  let { id } = useParams();
  // username associated with user id
  const [username, setUsername] = useState<string>("");
  const [posts, setPosts] = useState<PostObject[]>([]);

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
          setPosts(response.data);
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
  }, [id]);

  return (
    <>
      {authState.status ? (
        <div className="mt-10">
          <div>
            <h1 className="text-center">Hello, {username}!</h1>
          </div>
          <div>
            {posts.length === 0 ? (
              <div>
                <h1>You currently do not own any posts.</h1>
              </div>
            ) : (
              <div>You have posts.</div>
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
