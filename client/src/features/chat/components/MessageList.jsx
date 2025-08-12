import { AnimatePresence } from "framer-motion";
import MessageItem from "./MessageItem";

const DateSeparator = ({ date }) => (
  <div className="relative flex justify-center">
    <div className="absolute top-1/2 left-0 w-full h-px bg-gray-600/50"></div>
    <div className="relative bg-gray-800 text-gray-400 text-xs font-semibold px-4 py-1 rounded-full z-10">
      {date}
    </div>
  </div>
);

const MessageList = ({
  messages,
  user,
  onImageClick,
  messagesEndRef,
  onUserAvatarClick,
  onOpenMenu,
  onScrollToReply,
}) => {
  return (
    <main className="flex-1 space-y-6 overflow-y-auto p-3 sm:p-4 md:p-6">
      <AnimatePresence initial={false}>
        {messages.map((item) => {
          if (item.type === "date_separator") {
            return <DateSeparator key={item.id} date={item.date} />;
          }

          return (
            <MessageItem
              key={item.tempId || item._id}
              msg={item}
              isSentByMe={item.sender?._id === user?._id}
              user={user}
              onImageClick={onImageClick}
              onUserAvatarClick={onUserAvatarClick}
              onOpenMenu={onOpenMenu}
              onScrollToReply={onScrollToReply}
            />
          );
        })}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </main>
  );
};

export default MessageList;
