import {
  DotsVerticalIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import UserCard from "./UserCard";
import { getSender } from "../../config/chatLogics";
import { Badge } from "../ui/badge";
import { DialogClose } from "@radix-ui/react-dialog";

interface User {
  _id: string;
  email: string;
  username: string;
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

interface SearchData {
  chats: Chat[] | null;
  user: User | null;
}

function Header(props: any) {
  const chatState = ChatState();
  const navigate = useNavigate();
  const avatarImage = chatState?.user?.image;
  const avatarFallback = chatState?.user?.username[0];
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        if (searchValue.length !== 0) {
          const res = await axios.post(
            "http://localhost:5000/api/chat/search",
            { searchTerm: searchValue },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          const dataWithoutGroups = res.data.chats.filter((chat: Chat) => !chat.isGroupChat);
          console.log(dataWithoutGroups)
          setSearchData({chats: dataWithoutGroups, user: null});
        } else {
          setSearchData(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [searchValue]);

  const logout = async () => {
    try {
      await axios.delete("http://localhost:5000/api/user/sign-out", {
        withCredentials: true,
      });
    } catch (error) {
      console.log(`Log out failed: ${error}`);
    } finally {
      chatState?.removeCookie("jive.session-token");
      chatState?.setUser(null);
      chatState?.setSelectedChat(null);
      navigate("/sign-in");
    }
  };

  const handleCreateGroup = async (e: any) => {
    if (groupUsers.length < 1) {
      console.log("Group should have at least 2 people");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/group-create",
        {
          users: JSON.stringify(groupUsers),
          chatName: groupName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      chatState?.setChats((prev: Chat[]) => {
        if (!prev.some((chat) => chat._id === data._id)) {
          return [...prev, data];
        } else {
          return prev;
        }
      });
      chatState?.setSelectedChat(data);
      setGroupName("");
      setGroupUsers([]);
      setSearchValue("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-muted p-3">
      <div
        className={`${
          searchVisible ? "hidden" : "flex"
        } md:flex items-center justify-between w-full`}
      >
        <Avatar className="hidden md:block">
          <AvatarImage src={`${avatarImage}`} />
          <AvatarFallback className="bg-muted-foreground">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <h1 className="block md:hidden text-2xl font-bold py-1">Jive</h1>
        <div className="flex gap-3">
          <MagnifyingGlassIcon
            className="md:hidden w-5 h-5 text-muted-foreground"
            onClick={() => setSearchVisible(true)}
          />
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <DotsVerticalIcon className="h-5 w-5 text-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="-right-1 absolute">
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <span>New Group</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="h-screen md:h-auto w-[100vw] max-w-none md:max-w-lg">
              <DialogHeader>
                <DialogTitle>New Group Chat</DialogTitle>
              </DialogHeader>
              <div className="md:mt-5">
                <form className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <Input
                    type="search"
                    placeholder="Add User"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    {groupUsers.length !== 0 &&
                      groupUsers.map((user) => (
                        <Badge
                          key={user._id}
                          variant="outline"
                          onClick={() =>
                            setGroupUsers((prev: User[]) =>
                              prev.filter((u) => u._id !== user._id)
                            )
                          }
                        >
                          {user.username}
                        </Badge>
                      ))}
                  </div>
                  <div>
                    {!searchValue ? (
                      <></>
                    ) : searchData?.chats && searchData.chats.length !== 0 ? (
                      searchData.chats.slice(0, 4).map((chat) => (
                        <div
                          key={chat._id}
                          onClick={() =>
                            setGroupUsers((prev) => {
                              if (
                                !prev.some(
                                  (u) =>
                                    u._id ===
                                    getSender(chatState?.user, chat.users)._id
                                )
                              ) {
                                return [
                                  ...prev,
                                  getSender(chatState?.user, chat.users),
                                ];
                              } else {
                                return prev;
                              }
                            })
                          }
                        >
                          <UserCard
                            user={getSender(chatState?.user, chat.users)}
                          />
                        </div>
                      ))
                    ) : searchData?.user ? (
                      <div>
                        <UserCard user={searchData.user} />
                      </div>
                    ) : (
                      <p>No results</p>
                    )}
                  </div>
                </form>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="w-full" onClick={handleCreateGroup}>
                    Create Group
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div
        className={`${
          searchVisible ? "block" : "hidden"
        } md:hidden w-full py-[2px]`}
      >
        <form>
          <div className="relative">
            <ArrowLeftIcon
              className="absolute w-5 h-5 top-2 left-3 text-muted-foreground"
              onClick={() => setSearchVisible(false)}
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
