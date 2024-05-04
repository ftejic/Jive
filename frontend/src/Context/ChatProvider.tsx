import { createContext, useContext, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";

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
  groupAdmins?: User[];
  users: User[];
  latestMessage: Message;
  sender?: User;
}

interface ChatContextType {
  user: User | null;
  setUser: any;
  selectedChat: Chat | null;
  setSelectedChat: any;
  chats: Chat[] | null;
  setChats: any;
  messages: Message[] | null;
  setMessages: any;
  cookie: any;
  setCookie: any;
  removeCookie: any;
  visible: boolean;
  setVisible: any;
  joinedRooms: string[];
  setJoinedRooms: any;
}

const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: { children: any }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [cookie, setCookie, removeCookie] = useCookies(["jive.session-token"]);
  const [visible, setVisible] = useState(true);
  const [joinedRooms, setJoinedRooms] = useState([]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,
        messages,
        setMessages,
        cookie,
        setCookie,
        removeCookie,
        visible,
        setVisible,
        joinedRooms,
        setJoinedRooms,
      }}
    >
      <CookiesProvider>{children}</CookiesProvider>
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
