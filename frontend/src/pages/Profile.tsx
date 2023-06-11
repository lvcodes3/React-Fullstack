// dependencies
import { useContext } from "react";
// context
import { AuthContext } from "../helpers/AuthContext";

const Profile = () => {
  const { authState } = useContext(AuthContext);
  console.log(authState);

  return (
    <div className="mt-10">
      <h1 className="text-center">Welcome, {authState.username}!</h1>
    </div>
  );
};
export default Profile;
