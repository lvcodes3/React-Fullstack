// dependencies
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
// context
import { AuthContext } from "../helpers/AuthContext";
// react-icons
import { FaUser } from "react-icons/fa";

type UsersObject = {
  id: number;
  username: string;
  createdAt: string;
  updatedAt: string;
};

type ErrorResponse = {
  error: string;
};

const Users = () => {
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  const [users, setUsers] = useState<UsersObject[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/users", {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        });
        //console.log(response);
        if (response.status === 200) {
          setUsers(response.data);
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
    if (authState.status) {
      getUsers();
    }
  }, [authState.status]);

  return (
    <>
      {authState.status ? (
        users.length === 0 ? (
          <div className="text-center text-2xl font-bold">
            There are currently no other users in Social Posts!
          </div>
        ) : (
          <div className="flex flex-col items-center mt-10">
            <h1 className="text-center text-2xl font-bold mb-5">Users</h1>
            {users.map((user) => {
              return (
                <div
                  key={user.id}
                  className="w-3/4 h-20 bg-blue-600 rounded-md mb-10 flex flex-col items-center justify-center"
                >
                  <button
                    className="flex items-center bg-white hover:bg-gray-200 text-black font-bold py-1 px-2 rounded"
                    onClick={() => {
                      navigate(`/profile/${user.id}`);
                    }}
                  >
                    {user.username}
                    <FaUser className="ml-1" />
                  </button>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center mt-10">
          Log in to view Users!
        </div>
      )}
    </>
  );
};
export default Users;
