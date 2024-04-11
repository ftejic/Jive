import { ChatState } from "../../Context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/chatLogics";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ScrollableFeed from "react-scrollable-feed";

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
}

interface Message {
  _id: string;
  sender: User;
  content: string;
}

interface Props {
  messages: Message[];
}

function Messages(props: Props) {
  const chatState = ChatState();

  return (
    <ScrollableFeed className="ScrollBar h-full py-2 px-4">
      {props.messages &&
        props.messages.map((message, index) => (
          <div
            key={message._id}
            className={`flex items-center ${
              isSameUser(props.messages, message, index) ? "mt-1" : "mt-10"
            }`}
          >
            {(isSameSender(
              props.messages,
              message,
              index,
              chatState?.user?._id
            ) ||
              isLastMessage(props.messages, index, chatState?.user?._id)) && (
              <Avatar className="hidden md:block">
                <AvatarImage src={chatState?.selectedChat?.sender?.image} />
                <AvatarFallback className="bg-muted-foreground">
                  {chatState?.selectedChat?.sender?.username[0]}
                </AvatarFallback>
              </Avatar>
            )}
            <p
              className={`${
                message.sender._id === chatState?.user?._id
                  ? "bg-muted-foreground"
                  : "bg-muted"
              } rounded-[4px] px-2 ${isSameSenderMargin(
                props.messages,
                message,
                index,
                chatState?.user?._id
              )}`}
            >
              {message.content}
            </p>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default Messages;
