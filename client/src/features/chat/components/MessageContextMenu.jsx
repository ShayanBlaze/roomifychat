import { FiEdit, FiTrash2, FiCornerUpLeft } from "react-icons/fi";

const MessageContextMenu = ({
  message,
  position,
  onClose,
  onReply,
  onEdit,
  onDelete,
  isSentByMe,
}) => {
  if (!position.x) return null;

  const menuStyle = {
    top: `${position.y}px`,
    left: `${position.x}px`,
  };

  const menuItemClass =
    "flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer";

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="fixed z-50 bg-gray-800 border border-gray-700 rounded-md shadow-lg w-40"
        style={menuStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="py-1">
          <li
            className={menuItemClass}
            onClick={() => {
              onReply(message);
              onClose();
            }}
          >
            <FiCornerUpLeft />
            <span>Reply</span>
          </li>
          {isSentByMe && (
            <>
              <li
                className={menuItemClass}
                onClick={() => {
                  onEdit(message);
                  onClose();
                }}
              >
                <FiEdit />
                <span>Edit</span>
              </li>
              <li
                className={`${menuItemClass} text-red-400 hover:text-red-500`}
                onClick={() => {
                  onDelete(message._id);
                  onClose();
                }}
              >
                <FiTrash2 />
                <span>Delete</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MessageContextMenu;
