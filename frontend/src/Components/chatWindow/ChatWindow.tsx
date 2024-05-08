import { ChatState } from "../../Context/ChatProvider";
import Chat from "./Chat";
import ChatWindowHeader from "./ChatWindowHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import axios from "axios";
import { socket } from "../../socket";

interface Props {
  userInfoWindowVisible: boolean;
  groupInfoWindowVisible: boolean;
  setUserInfoWindowVisible: any;
  setGroupInfoWindowVisible: any;
  onlyAdminDialogVisible: boolean;
  setOnlyAdminDialogVisible: any;
  exitGroupDialogVisible: boolean;
  setExitGroupDialogVisible: any;
  deleteGroupDialogVisible: boolean;
  setDeleteGroupDialogVisible: any;
  groupName: any;
  setFetchAgain: any;
}

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
  chat: ChatInterface;
  updatedAt: string;
}

interface ChatInterface {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: Message;
  sender?: User;
  image: string;
  updatedAt: string;
}

function ChatWindow(props: Props) {
  const chatState = ChatState();

  const deleteGroup = async () => {
    if (chatState?.selectedChat) {
      try {
        await axios.delete("http://localhost:5000/api/chat/group-delete", {
          data: {
            chatId: chatState.selectedChat._id,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        socket.emit("group delete", chatState.selectedChat._id);
        if (chatState?.chats) {
          const chats = [...chatState.chats];
          const indexOfChat = chats.findIndex(
            (c) => c._id === chatState?.selectedChat?._id
          );
          chats.splice(indexOfChat, 1);
          chatState?.setChats(chats);
        }
        chatState?.setSelectedChat(null);
        chatState?.setMessages(null);
        props.setGroupInfoWindowVisible(false);
        chatState?.setVisible(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const exitGroup = async () => {
    try {
      if (chatState?.selectedChat?.users.length === 1) {
        deleteGroup();
      } else if (
        chatState?.selectedChat?.groupAdmins?.length === 1 &&
        chatState?.selectedChat?.groupAdmins[0]._id === chatState.user?._id
      ) {
        props.setOnlyAdminDialogVisible(true);
      } else {
        const { data } = await axios.put(
          "http://localhost:5000/api/chat/group-remove",
          {
            chatId: chatState?.selectedChat?._id,
            userId: chatState?.user?._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        socket.emit("group change", data);
        if (chatState?.chats) {
          const chats = [...chatState.chats];
          const indexOfChat = chats.findIndex(
            (c) => c._id === chatState?.selectedChat?._id
          );
          chats.splice(indexOfChat, 1);
          chatState?.setChats(chats);
        }
        chatState?.setMessages(null);
        chatState?.setSelectedChat(null);
        chatState?.setVisible(true);
        props.setGroupInfoWindowVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`ChatWindow ${
        props.userInfoWindowVisible || props.groupInfoWindowVisible
          ? "hidden"
          : !chatState?.visible
          ? "flex"
          : "hidden"
      } lg:flex flex-col col-start-1 col-end-13 ${
        props.userInfoWindowVisible || props.groupInfoWindowVisible
          ? "md:border-r md:hidden lg:col-end-9 xl:col-end-10"
          : "md:flex md:col-end-13"
      } md:col-start-5 max-h-screen`}
    >
      {chatState?.selectedChat ? (
        <>
          <ChatWindowHeader
            setUserInfoWindowVisible={props.setUserInfoWindowVisible}
            setGroupInfoWindowVisible={props.setGroupInfoWindowVisible}
            setExitGroupDialogVisible={props.setExitGroupDialogVisible}
          />
          <Chat />
        </>
      ) : (
        <div className="flex items-center h-full justify-center">Jive</div>
      )}
      <AlertDialog
        open={props.exitGroupDialogVisible}
        onOpenChange={props.setExitGroupDialogVisible}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              Exit "{props.groupName}" group?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-y-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => exitGroup()}>
              Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={props.onlyAdminDialogVisible}
        onOpenChange={props.setOnlyAdminDialogVisible}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              You cannot leave the group because you are the only administrator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={props.deleteGroupDialogVisible}
        onOpenChange={props.setDeleteGroupDialogVisible}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to delete "{props.groupName}" group?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteGroup()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ChatWindow;
