// dependencies
import { useContext } from "react";
// context
import { AuthContext } from "../helpers/AuthContext";

const Profile = () => {
  const { authState } = useContext(AuthContext);
  console.log(authState);

  return (
    <>
      {authState.status ? (
        <div className="mt-10">
          <h1 className="text-center">Welcome, {authState.username}!</h1>
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
