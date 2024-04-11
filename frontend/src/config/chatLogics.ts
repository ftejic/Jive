interface User {
  _id: string;
  email: string;
  username: string;
  image: string;
}

interface Message {
  _id: string;
  sender: User;
  content: string;
}

export const getSender = (
  loggedUser: User | null | undefined,
  users: User[]
) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

export const isSameSender = (
  messages: Message[],
  message: Message,
  index: number,
  userId: string | undefined
) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== userId
  );
};

export const isLastMessage = (
  messages: Message[],
  index: number,
  userId: string | undefined
) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (
  messages: Message[],
  message: Message,
  index: number,
  userId: string | undefined
) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1].sender._id === message.sender._id &&
    messages[index].sender._id !== userId
  )
    return 'ml-0 md:ml-12';
  else if (
    (index < messages.length - 1 &&
      messages[index + 1].sender._id !== message.sender._id &&
      messages[index].sender._id !== userId) ||
    (index === messages.length - 1 && messages[index].sender._id !== userId)
  )
    return 'ml-0 md:ml-2';
  else return "ml-auto";
};

export const isSameUser = (messages: Message[], message: Message, index: number) => {
    return index > 0 && messages[index - 1].sender._id === message.sender._id;
  };