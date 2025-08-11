import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={onClose}
      >
        <IoClose />
      </motion.button>
      <motion.img
        layoutId={`chat-image-${imageUrl}`}
        src={imageUrl}
        alt="Enlarged view"
        className="max-w-full max-h-full rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

export default ImageModal;
