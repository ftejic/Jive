import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function ChatWindowHeader() {
  const chatState = ChatState();
  return (
    <div className="bg-muted py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="hidden md:block">
          <AvatarImage src={chatState?.selectedChat?.sender?.image} />
          <AvatarFallback className="bg-muted-foreground">
            {chatState?.selectedChat?.isGroupChat
              ? chatState.selectedChat.chatName[0]
              : chatState?.selectedChat?.sender?.username[0]}
          </AvatarFallback>
        </Avatar>
        <p>{chatState?.selectedChat?.chatName}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <DotsVerticalIcon className="h-5 w-5 text-foreground" />
        </DropdownMenuTrigger>
        {chatState?.selectedChat?.isGroupChat ? (
          <DropdownMenuContent className="-right-1 absolute">
            <DropdownMenuItem>Group info</DropdownMenuItem>
            <DropdownMenuItem>Exit Group</DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className="-right-1 absolute">
            <DropdownMenuItem>View User</DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}

export default ChatWindowHeader;
