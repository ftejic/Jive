import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from "../../config/chatLogics";
import ChatCard from "./ChatCard";
import UserCard from "./UserCard";
import { socket } from "../../socket";

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
  searchData: {
    chats: Chat[] | null;
    user: User | null;
  } | null;
  setSearchValue: any;
  setGroupInfoWindowVisible: any;
  setUserInfoWindowVisible: any;
  setSearchVisible: any;
  getTime: any;
}

function SearchResults(props: Props) {
  const chatState = ChatState();

  const createChat = async (userId: string | undefined) => {
    try {
      const { data }: { data: {chat: Chat, created: boolean} } = await axios.post(
        `${process.env.REACT_APP_SERVERURL}/api/chat/`,
        { userId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const sender = getSender(chatState?.user, data.chat.users);

      chatState?.setChats((prev: Chat[]) => {
        if (!prev.some((chat) => chat._id === data.chat._id)) {
          return [...prev, data.chat];
        } else {
          return prev;
        }
      });
      chatState?.setSelectedChat({
        ...data.chat,
        chatName: sender.username,
        sender,
      });
      props.setSearchValue("");
      props.setSearchVisible(false);

      if(data.created) {
        socket.emit("new chat", data.chat);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {props.searchData?.chats?.length !== 0 ? (
        <div>
          {props.searchData?.chats?.map((chat) => {
            const sender = getSender(chatState?.user, chat.users);
            return (
              <div
                key={chat._id}
                onClick={() => {
                  chat.isGroupChat
                    ? chatState?.setSelectedChat(chat)
                    : chatState?.setSelectedChat({
                        ...chat,
                        chatName: sender.username,
                        sender,
                      });
                  props.setSearchValue("");
                  chatState?.setVisible(false);
                  props.setGroupInfoWindowVisible(false);
                  props.setUserInfoWindowVisible(false);
                  props.setSearchVisible(false);
                }}
                className="cursor-pointer px-4 hover:bg-muted/30"
              >
                <ChatCard
                  _id={chat._id}
                  chatName={chat.isGroupChat ? chat.chatName : sender.username}
                  isGroupChat={chat.isGroupChat}
                  latestMessage={chat.latestMessage ? chat.latestMessage : null}
                  image={chat.image}
                  sender={sender}
                  dateTime={props.getTime(chat.latestMessage?.updatedAt ? chat.latestMessage?.updatedAt : null)}
                />
              </div>
            );
          })}
        </div>
      ) : props.searchData?.user ? (
        <div>
          <div
            onClick={() => createChat(props.searchData?.user?._id)}
            className="cursor-pointer px-4"
          >
            <UserCard user={props.searchData.user} textVisible={true} />
          </div>
        </div>
      ) : (
        <p className="p-4 italic">No results found</p>
      )}
    </div>
  );
}

export default SearchResults;
