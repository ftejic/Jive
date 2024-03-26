import { useEffect } from "react";
import ChatCard from "./ChatCard";
import axios from "axios";
import { getSender } from "../../config/chatLogics";
import { ChatState } from "../../Context/ChatProvider";

// interface User {
//   _id: string;
//   email: string;
//   username: string;
//   image: string;
// }

// interface Message {
//   sender: User;
//   content: string;
// }

// interface Chat {
//   _id: string;
//   chatName: string;
//   isGroupChat: boolean;
//   users: User[];
//   latestMessage: Message;
// }

function Chats() {
  const chatState = ChatState();

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/chat", {
          withCredentials: true,
        });

        chatState?.setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, []);

  return (
    <div>
      {chatState?.chats ? (
        chatState?.chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => {
              chat.isGroupChat
                ? chatState.setSelectedChat(chat)
                : chatState.setSelectedChat({
                    ...chat,
                    chatName: getSender(chatState?.user, chat.users),
                  });
            }}
          >
            <ChatCard
              _id={chat._id}
              chatName={
                chat.isGroupChat
                  ? chat.chatName
                  : getSender(chatState?.user, chat.users)
              }
              latestMessage={
                chat.latestMessage ? chat.latestMessage.content : ""
              }
            />
          </div>
        ))
      ) : (
        <p>You dont have any chats</p>
      )}
    </div>
  );
}

export default Chats;
