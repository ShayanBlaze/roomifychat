import React, { useContext } from "react";
import { AuthContext } from "../../features/auth/context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-4">
        Welcome to the Dashboard
      </h1>
      <p className="text-lg font-semibold">User Information:</p>
      <ul className="list-disc list-inside">
        <li>Name: {user.name}</li>
        <li>Email: {user.email}</li>
      </ul>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default Dashboard;
