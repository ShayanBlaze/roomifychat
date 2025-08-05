import useAuth from "../../features/auth/hooks/useAuth";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          You can view your conversations in the 'Chat' section or edit your
          profile.
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
