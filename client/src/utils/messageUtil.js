const formatDateSeparator = (dateString) => {
  const messageDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  messageDate.setHours(0, 0, 0, 0);

  if (messageDate.getTime() === today.getTime()) {
    return "Today";
  }
  if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }
  return messageDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * @param {Array} messages Array of message objects.
 * @returns {Array} New array including messages and date separators.
 */
export const groupMessagesByDate = (messages) => {
  if (!messages || messages.length === 0) {
    return [];
  }

  const groupedItems = [];
  let lastDateString = null;

  messages.forEach((message) => {
    if (!message.createdAt) return;

    const messageDate = new Date(message.createdAt);
    const messageDateString = messageDate.toDateString();

    if (messageDateString !== lastDateString) {
      groupedItems.push({
        type: "date_separator",
        id: `date-${message.createdAt}`,
        date: formatDateSeparator(message.createdAt),
      });
      lastDateString = messageDateString;
    }
    groupedItems.push(message);
  });

  return groupedItems;
};
