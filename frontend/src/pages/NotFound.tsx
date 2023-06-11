// dependencies
import { Link } from "react-router-dom";
// react-icons
import { FaExclamationCircle } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="mt-10">
      <div className="flex justify-center items-center">
        <FaExclamationCircle className="text-xl text-red-500" />
        <h1 className="text-xl px-5">Page Not Found</h1>
        <FaExclamationCircle className="text-xl text-red-500" />
      </div>
      <div className="flex justify-center items-center mt-10">
        <Link to="/" className="hover:underline">
          Redirect To Home Page
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
