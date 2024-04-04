import { useEffect } from "react";
import ChatCard from "./ChatCard";
import axios from "axios";
import { getSender } from "../../config/chatLogics";
import { ChatState } from "../../Context/ChatProvider";

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
              const sender = getSender(chatState?.user, chat.users);
              chat.isGroupChat
                ? chatState.setSelectedChat({...chat, sender})
                : chatState.setSelectedChat({
                    ...chat,
                    chatName: sender.username,
                  });
              chatState.setVisible((prev: boolean) => !prev);
            }}
            className="cursor-pointer"
          >
            <ChatCard
              _id={chat._id}
              chatName={
                chat.isGroupChat
                  ? chat.chatName
                  : getSender(chatState?.user, chat.users).username
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
