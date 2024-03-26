import { createContext, useContext, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";

interface User {
  _id: string;
  username: string;
  email: string;
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

interface ChatContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedChat: Chat | null;
  setSelectedChat: (selectedChat: Chat | null) => void;
  chats: Chat[] | null;
  setChats: (chats: Chat[] | null) => void;
  cookie: any;
  setCookie: any;
  removeCookie: any;
}

const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: { children: any }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [cookie, setCookie, removeCookie] = useCookies(["jive.session-token"]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,
        cookie,
        setCookie,
        removeCookie
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
