import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainPanel from "../Components/MainPanel/MainPanel";
import ChatWindow from "../Components/ChatWindow/ChatWindow";
import { ChatState } from "../Context/ChatProvider";
import GroupInfoWindow from "../Components/GroupInfoWindow/GroupInfoWindow";
import UserInfoWindow from "../Components/UserInfoWindow/UserInfoWindow";
import { socket } from "../socket";

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

function HomePage() {
  const chatState = ChatState();
  const navigate = useNavigate();

  const [userInfoWindowVisible, setUserInfoWindowVisible] = useState(false);
  const [groupInfoWindowVisible, setGroupInfoWindowVisible] = useState(false);
  const [isChatStateUpdated, setIsChatStateUpdated] = useState(false);
  const [exitGroupDialogVisible, setExitGroupDialogVisible] = useState(false);
  const [deleteGroupDialogVisible, setDeleteGroupDialogVisible] =
    useState(false);
  const [onlyAdminDialogVisible, setOnlyAdminDialogVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [fetchAgain, setFetchAgain] = useState(true);

  const getChats = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/chat", {
        withCredentials: true,
      });
      chatState?.setChats(data);
      setIsChatStateUpdated(true);
      // JOIN ALL ROOMS
      data.forEach((chat: Chat) => {
        chatState?.setJoinedRooms((prev: string[]) => [...prev, chat._id]);
        socket.emit("join chat", chat._id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/user/check-auth",
          {
            withCredentials: true,
          }
        );
        socket.connect();
        socket.on("connect", () => {
          if (data && data?.user && data?.user?._id) {
            socket.emit("initial-data", data.user._id);
          }
        });
        chatState?.setUser(data.user);
      } catch (error) {
        console.log(error);
        navigate("/sign-in");
      }
    };
    getUser();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getChats();
  }, [fetchAgain]);

  useEffect(() => {
    const updateChatsOnNewMessage = (newMessage: Message) => {
      if (chatState?.chats) {
        const chats = [...chatState.chats];
        const indexOfChat = chats.findIndex(
          (c) => c._id === newMessage.chat._id
        );
        chats[indexOfChat].latestMessage = newMessage;

        const updatedChat = chats.splice(indexOfChat, 1)[0];
        chats.unshift(updatedChat);

        chatState?.setChats(chats);
      }
    };

    const onMessageRecived = (newMessage: Message) => {
      updateChatsOnNewMessage(newMessage);
      if (
        !chatState?.selectedChat ||
        chatState.selectedChat._id !== newMessage.chat._id
      ) {
        // ADD NOTIFICATION
      } else {
        chatState?.setMessages((prevMessages: Message[]) => [
          ...prevMessages,
          newMessage,
        ]);
      }
    };

    const onGroupCreate = () => {
      getChats();
    };

    const onGroupChange = (newGroup: Chat) => {
      if (chatState?.chats) {
        const chats = [...chatState.chats];
        const indexOfChat = chats.findIndex((c) => c._id === newGroup._id);
        chats[indexOfChat] = newGroup;
        chatState?.setChats(chats);

        if (newGroup._id === chatState?.selectedChat?._id) {
          chatState.setSelectedChat(newGroup);
        }
      }
    };

    const onGroupDelete = (groupId: string) => {
      getChats();

      if (groupId === chatState?.selectedChat?._id) {
        chatState.setSelectedChat(null);
        chatState.setVisible(true);
      }
    };

    const onUserRemove = (groupId: string) => {
      getChats();

      if (groupId === chatState?.selectedChat?._id) {
        chatState.setSelectedChat(null);
        chatState.setVisible(true);
      }
    };

    const onUserAdd = () => {
      getChats();
    };

    socket.on("message received", onMessageRecived);
    socket.on("group created", onGroupCreate);
    socket.on("group changed", onGroupChange);
    socket.on("group deleted", onGroupDelete);
    socket.on("user removed", onUserRemove);
    socket.on("user added", onUserAdd);

    return () => {
      socket.off("message received", onMessageRecived);
      socket.off("group created", onGroupCreate);
      socket.off("group changed", onGroupChange);
      socket.off("group deleted", onGroupDelete);
      socket.off("user removed", onUserRemove);
      socket.off("user added", onUserAdd);
    };
  }, [isChatStateUpdated, chatState?.selectedChat]);

  useEffect(() => {
    if (chatState?.selectedChat?.chatName) {
      setGroupName(chatState.selectedChat.chatName);
    }
  }, [chatState?.selectedChat?.chatName]);

  return (
    <div className="HomePage max-w-screen-2xl h-screen mx-auto grid grid-cols-12">
      <MainPanel
        userInfoWindowVisible={userInfoWindowVisible}
        groupInfoWindowVisible={groupInfoWindowVisible}
        setUserInfoWindowVisible={setUserInfoWindowVisible}
        setGroupInfoWindowVisible={setGroupInfoWindowVisible}
      />
      <ChatWindow
        userInfoWindowVisible={userInfoWindowVisible}
        groupInfoWindowVisible={groupInfoWindowVisible}
        setUserInfoWindowVisible={setUserInfoWindowVisible}
        setGroupInfoWindowVisible={setGroupInfoWindowVisible}
        exitGroupDialogVisible={exitGroupDialogVisible}
        setExitGroupDialogVisible={setExitGroupDialogVisible}
        onlyAdminDialogVisible={onlyAdminDialogVisible}
        setOnlyAdminDialogVisible={setOnlyAdminDialogVisible}
        deleteGroupDialogVisible={deleteGroupDialogVisible}
        setDeleteGroupDialogVisible={setDeleteGroupDialogVisible}
        groupName={groupName}
        setFetchAgain={setFetchAgain}
      />
      <GroupInfoWindow
        groupInfoWindowVisible={groupInfoWindowVisible}
        setGroupInfoWindowVisible={setGroupInfoWindowVisible}
        setExitGroupDialogVisible={setExitGroupDialogVisible}
        setDeleteGroupDialogVisible={setDeleteGroupDialogVisible}
        groupName={groupName}
        setGroupName={setGroupName}
      />
      <UserInfoWindow
        userInfoWindowVisible={userInfoWindowVisible}
        setUserInfoWindowVisible={setUserInfoWindowVisible}
      />
    </div>
  );
}

export default HomePage;
