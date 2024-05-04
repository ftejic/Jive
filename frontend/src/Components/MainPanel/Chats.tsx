import ChatCard from "./ChatCard";
import { getSender } from "../../config/chatLogics";
import { ChatState } from "../../Context/ChatProvider";

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
  chat: Chat;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: Message;
  sender?: User;
}

interface Props {
  setUserInfoWindowVisible: any;
  setGroupInfoWindowVisible: any;
}

function Chats(props: Props) {
  const chatState = ChatState();

  return (
    <div>
      {chatState?.chats ? (
        chatState?.chats.map((chat) => {
          const sender = getSender(chatState?.user, chat.users);
          return (
            <div
              key={chat._id}
              onClick={() => {
                !chat.isGroupChat
                  ? chatState.setSelectedChat({ ...chat, sender })
                  : chatState.setSelectedChat({
                      ...chat,
                    });
                chatState.setVisible(false);
                props.setGroupInfoWindowVisible(false);
                props.setUserInfoWindowVisible(false);
              }}
              className={`cursor-pointer px-4 ${
                chatState.selectedChat?._id === chat._id
                  ? "md:bg-muted/70"
                  : "bg-transparent"
              } ${
                chatState.selectedChat?._id !== chat._id &&
                "md:hover:bg-muted/30"
              }`}
            >
              <ChatCard
                _id={chat._id}
                chatName={chat.isGroupChat ? chat.chatName : sender.username}
                isGroupChat={chat.isGroupChat}
                latestMessage={chat.latestMessage ? chat.latestMessage : null}
              />
            </div>
          );
        })
      ) : (
        <p>You dont have any chats</p>
      )}
    </div>
  );
}

export default Chats;
