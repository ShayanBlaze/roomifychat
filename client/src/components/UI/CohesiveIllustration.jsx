import { motion } from "framer-motion";

const CohesiveIllustration = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center aspect-square">
      <motion.div
        className="absolute w-full h-full rounded-full bg-emerald-500/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <motion.div
        className="absolute w-1/3 h-1/3 rounded-full bg-cyan-400/50"
        style={{ top: "15%", left: "20%" }}
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />

      <motion.div
        className="absolute w-1/4 h-1/4 rounded-full bg-emerald-400/60"
        style={{ bottom: "25%", right: "15%" }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <motion.div
        className="absolute w-1/6 h-1/6 rounded-full bg-white/20"
        style={{ top: "30%", right: "30%" }}
        animate={{
          y: [0, 5, 0],
          x: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default CohesiveIllustration;
