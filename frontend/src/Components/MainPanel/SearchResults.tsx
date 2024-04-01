import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from "../../config/chatLogics";
import ChatCard from "./ChatCard";
import UserCard from "./UserCard";

interface User {
  _id: string;
  email: string;
  username: string;
  image: string;
}

interface Message {
  sender: User;
  content: string;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: Message;
}

interface Props {
  searchData: {
    chats: Chat[] | null;
    user: User | null;
  } | null;
}

function SearchResults(props: Props) {
  const chatState = ChatState();

  const createChat = async (userId: string | undefined) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat/",
        { userId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      chatState?.setSelectedChat({
        ...res.data,
        chatName: getSender(chatState?.user, res.data.users),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {props.searchData?.chats?.length !== 0 ? (
        <div>
          {props.searchData?.chats?.map((chat) => (
            <div
              key={chat._id}
              onClick={() =>
                chat.isGroupChat
                  ? chatState?.setSelectedChat(chat)
                  : chatState?.setSelectedChat({
                      ...chat,
                      chatName: getSender(chatState?.user, chat.users),
                    })
              }
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
          ))}
        </div>
      ) : props.searchData?.user ? (
        <div>
          <div
            onClick={() => createChat(props.searchData?.user?._id)}
            className="cursor-pointer"
          >
            <UserCard user={props.searchData.user} />
          </div>
        </div>
      ) : (
        <p className="p-3 italic">No results found</p>
      )}
    </div>
  );
}

export default SearchResults;
