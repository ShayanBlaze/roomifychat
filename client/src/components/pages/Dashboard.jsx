import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import useAuth from "../../features/auth/hooks/useAuth";
import CohesiveIllustration from "../UI/CohesiveIllustration";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 text-white bg-gray-900 overflow-hidden">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
          className="flex flex-col text-center md:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl lg:text-6xl font-bold leading-tight"
            variants={itemVariants}
          >
            Welcome back,
            <br />
            <span className="text-emerald-400">{user?.name}!</span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-lg text-lg text-gray-400 mx-auto md:mx-0"
            variants={itemVariants}
          >
            Jump back into your conversations or check out what's new. Your
            digital space awaits.
          </motion.p>

          <motion.div variants={itemVariants}>
            <button
              onClick={() => navigate("/chat/general")}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-300"
            >
              <span>Explore Chats</span>
              <FiArrowRight />
            </button>
          </motion.div>
        </motion.div>

        <div className="hidden md:flex items-center justify-center p-8">
          <CohesiveIllustration />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
