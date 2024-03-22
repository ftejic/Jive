import { UserContext } from "../../Pages/HomePage";
import { DotsVerticalIcon, MagnifyingGlassIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useContext, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

function Header() {
  const contextValue = useContext(UserContext);
  const avatarImage = contextValue?.user?.image;
  const avatarFallback = contextValue?.user?.username[0];
  const [searchVisible, setSearchVisible] = useState(true);

  return (
    <div className="bg-muted p-3">
      <div
        className={`${
          searchVisible ? "hidden" : "flex"
        } md:flex items-center justify-between w-full`}
      >
        <Avatar>
          <AvatarImage src={`${avatarImage}`} />
          <AvatarFallback className="bg-muted-foreground">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex gap-3">
          <MagnifyingGlassIcon className="md:hidden w-5 h-5 text-muted-foreground" onClick={() => setSearchVisible(true)}/>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <DotsVerticalIcon className="h-5 w-5 text-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>New Group</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={`${searchVisible ? "block" : "hidden"} md:hidden w-full py-[2px]`}>
        <form>
          <div className="relative">
            <ArrowLeftIcon className="absolute w-5 h-5 top-2 left-3 text-muted-foreground" onClick={() => setSearchVisible(false)}/>
            <Input
              type="search"
              placeholder="Search or start new chat"
              className="pl-11 lg:pl-14 shadow-none focus-visible:ring-0"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Header;
