import {
  DotsVerticalIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { ChatState } from "..//../Context/ChatProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  searchValue: string;
  setSearchValue: any;
  setIsCreateGroupSheetOpen: any;
  setIsSettingsOpen: any;
  searchVisible: boolean;
  setSearchVisible: any;
}

function Header(props: Props) {
  const chatState = ChatState();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVERURL}/api/user/sign-out`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(`Log out failed: ${error}`);
    } finally {
      chatState?.setUser(null);
      chatState?.setSelectedChat(null);
      navigate("/sign-in");
    }
  };

  return (
    <div className="bg-background md:bg-muted border-b md:border-b-0 border-muted/30 py-3 px-4">
      <div
        className={`${
          props.searchVisible ? "hidden" : "flex"
        } md:flex items-center justify-between w-full`}
      >
        <Avatar className="hidden md:block">
          <AvatarImage src={chatState?.user?.image} />
          <AvatarFallback className="bg-muted-foreground">
            {chatState?.user?.username[0]}
          </AvatarFallback>
        </Avatar>
        <h1 className="block md:hidden text-2xl font-bold py-1">Jive</h1>
        <div className="flex gap-3">
          <MagnifyingGlassIcon
            className="md:hidden w-5 h-5 text-muted-foreground"
            onClick={() => props.setSearchVisible(true)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <DotsVerticalIcon className="h-5 w-5 text-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="-right-1 absolute">
              <DropdownMenuItem
                onClick={() => props.setIsCreateGroupSheetOpen(true)}
              >
                New Group
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => props.setIsSettingsOpen(true)}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={`${
          props.searchVisible ? "block" : "hidden"
        } md:hidden w-full py-[2px]`}
      >
        <form>
          <div className="relative">
            <ArrowLeftIcon
              className="absolute w-5 h-5 top-2 left-3 text-muted-foreground"
              onClick={() => props.setSearchVisible(false)}
            />
            <Input
              type="search"
              placeholder="Search or start new chat"
              className="pl-11 lg:pl-14 shadow-none focus-visible:ring-0"
              value={props.searchValue}
              onChange={(e) => props.setSearchValue(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Header;
