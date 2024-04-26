import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import GroupInfoWindowHeader from "./GroupInfoWindowHeader";
import {
  CheckIcon,
  Cross2Icon,
  Pencil1Icon,
  ExitIcon,
} from "@radix-ui/react-icons";
import axios from "axios";
import { Input } from "../ui/input";
import UserCard from "../MainPanel/UserCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { getSender } from "../../config/chatLogics";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Badge } from "../ui/badge";
import GroupInfo from "./GroupInfo";
import GroupMembers from "./GroupMembers";

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
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  groupAdmins?: User[];
  users: User[];
  latestMessage: Message;
}

interface Props {
  groupInfoWindowVisible: boolean;
  setGroupInfoWindowVisible: any;
}

function GroupInfoWindow(props: Props) {
  const chatState = ChatState();
  const [groupName, setGroupName] = useState("");
  const [onlyAdminDialogVisible, setOnlyAdminDialogVisible] = useState(false);



  const isAdmin =
    chatState?.user &&
    chatState?.selectedChat?.groupAdmins?.some(
      (admin) => admin._id === chatState?.user?._id
    );

  useEffect(() => {
    if (chatState?.selectedChat?.chatName) {
      setGroupName(chatState.selectedChat.chatName);
    }
  }, [chatState?.selectedChat?.chatName]);

  const exitGroup = async () => {
    try {
      if (chatState?.selectedChat?.users.length === 1) {
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

          chatState?.setSelectedChat(null);
          chatState?.setMessages(null);
          props.setGroupInfoWindowVisible(false);
          chatState.setVisible(true);
        } catch (error) {
          console.log(error);
        }
      } else if (
        chatState?.selectedChat?.groupAdmins?.length === 1 &&
        chatState?.selectedChat?.groupAdmins[0]._id === chatState.user?._id
      ) {
        setOnlyAdminDialogVisible(true);
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
        chatState?.setMessages(null);
        chatState?.setSelectedChat(null);
        props.setGroupInfoWindowVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`${
        props.groupInfoWindowVisible ? "flex" : "hidden"
      } max-h-screen flex-col col-start-1 md:col-start-5 lg:col-start-9 xl:col-start-10 col-end-13`}
    >
      <GroupInfoWindowHeader
        setGroupInfoWindowVisible={props.setGroupInfoWindowVisible}
      />
      <ScrollArea>
        <GroupInfo
          groupName={groupName}
          setGroupName={setGroupName}
          isAdmin={isAdmin}
        />
        <GroupMembers isAdmin={isAdmin} groupName={groupName}/>
        <div className="px-4 py-10">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex items-center gap-3 text-destructive cursor-pointer">
                <ExitIcon className="w-5 h-5" />
                <p>Exit Group</p>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription>
                  Exit "{groupName}" group?
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
        </div>
      </ScrollArea>
      <AlertDialog
        open={onlyAdminDialogVisible}
        onOpenChange={setOnlyAdminDialogVisible}
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
    </div>
  );
}

export default GroupInfoWindow;
