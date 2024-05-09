import { ChatState } from "../../Context/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
  chat: Chat;
  updatedAt: string;
  isImage: boolean;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  groupAdmins?: User[];
  users: User[];
  latestMessage: Message;
  image: string;
  updatedAt: string;
}

interface Props {
  _id: string;
  chatName: string;
  sender?: User;
  latestMessage: Message | null;
  isGroupChat: boolean;
  image: string;
  dateTime: string | null;
}

function ChatCard(props: Props) {
  const chatState = ChatState();

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-10 w-10 xl:h-14 xl:w-14">
        <AvatarImage
          src={props.isGroupChat ? props.image : props.sender?.image}
          alt="Avatar"
        />
        <AvatarFallback className="bg-muted-foreground">
          {props.chatName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex justify-between w-full md:border-b py-4 md:py-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium leading-none">{props.chatName}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {props.latestMessage
              ? props.isGroupChat
                ? `${
                    props.latestMessage.sender._id === chatState?.user?._id
                      ? "You"
                      : props.latestMessage.sender.username
                  }: ${
                    props.latestMessage.isImage
                      ? `sent a photo`
                      : props.latestMessage.content
                  }`
                : props.latestMessage.isImage
                ? "photo"
                : props.latestMessage.content
              : "Start chat"}
          </p>
        </div>
        <div className="text-xs text-muted-foreground">{props.dateTime}</div>
      </div>
    </div>
  );
}

export default ChatCard;
