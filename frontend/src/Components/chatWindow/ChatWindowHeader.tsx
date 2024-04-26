import { DotsVerticalIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Props {
  setUserInfoWindowVisible: any;
  setGroupInfoWindowVisible: any;
}

function ChatWindowHeader(props: Props) {
  const chatState = ChatState();
  return (
    <div className="bg-muted py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1" onClick={() => chatState?.setVisible(true)}>
          <ArrowLeftIcon className="w-5 h-5 text-foreground md:hidden"/>
          <Avatar>
            <AvatarImage src={chatState?.selectedChat?.sender?.image} />
            <AvatarFallback className="bg-muted-foreground">
              {chatState?.selectedChat?.isGroupChat
                ? chatState.selectedChat.chatName[0]
                : chatState?.selectedChat?.sender?.username[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <p>
          {chatState?.selectedChat?.isGroupChat
            ? chatState.selectedChat.chatName
            : chatState?.selectedChat?.sender?.username}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <DotsVerticalIcon className="h-5 w-5 text-foreground" />
        </DropdownMenuTrigger>
        {chatState?.selectedChat?.isGroupChat ? (
          <DropdownMenuContent className="-right-1 absolute">
            <DropdownMenuItem
              onClick={() => props.setGroupInfoWindowVisible(true)}
            >
              Group info
            </DropdownMenuItem>
            <DropdownMenuItem>Exit Group</DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className="-right-1 absolute">
            <DropdownMenuItem
              onClick={() => props.setUserInfoWindowVisible(true)}
            >
              View User
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}

export default ChatWindowHeader;
