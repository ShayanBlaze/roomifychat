import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-4">Home Page</h1>
      <div className="flex justify-center space-x-4">
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
        <Link to="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
