import { useEffect } from "react";
import ChatCard from "./ChatCard";
import axios from "axios";
import { getSender } from "../../config/chatLogics";
import { ChatState } from "../../Context/ChatProvider";

interface Props {
  setUserInfoWindowVisible: any;
  setGroupInfoWindowVisible: any;
}

function Chats(props: Props) {
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
  }, [chatState?.messages]);


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
                chatState.selectedChat?._id !== chat._id && "hover:bg-muted/30"
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
