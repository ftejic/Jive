import { ChatState } from "../../Context/ChatProvider";
import { ScrollArea } from "../ui/scroll-area";
import GroupInfoWindowHeader from "./GroupInfoWindowHeader";
import { ExitIcon } from "@radix-ui/react-icons";
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
  image: string;
}

interface Props {
  groupInfoWindowVisible: boolean;
  setGroupInfoWindowVisible: any;
  setExitGroupDialogVisible: any;
  setDeleteGroupDialogVisible: any;
  groupName: string;
  setGroupName: any;
}

function GroupInfoWindow(props: Props) {
  const chatState = ChatState();

  const isAdmin =
    chatState?.user &&
    chatState?.selectedChat?.groupAdmins?.some(
      (admin) => admin._id === chatState?.user?._id
    );

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
          groupName={props.groupName}
          setGroupName={props.setGroupName}
          isAdmin={isAdmin}
        />
        <GroupMembers isAdmin={isAdmin} groupName={props.groupName} />
        <div>
          <div
            className="flex items-center px-4 py-4 gap-3 text-destructive cursor-pointer hover:bg-muted/30"
            onClick={() => props.setExitGroupDialogVisible(true)}
          >
            <ExitIcon className="w-5 h-5" />
            <p>Exit Group</p>
          </div>
          {isAdmin && (
            <div 
              className="flex items-center px-4 py-4 gap-3 text-destructive cursor-pointer hover:bg-muted/30"
              onClick={() => props.setDeleteGroupDialogVisible(true)}>
              <ExitIcon className="w-5 h-5" />
              <p>Delete group</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default GroupInfoWindow;
