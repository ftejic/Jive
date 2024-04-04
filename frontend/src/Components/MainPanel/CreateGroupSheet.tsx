import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { getSender } from "../../config/chatLogics";
import UserCard from "./UserCard";
import { Button } from "../ui/button";

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

interface Props {
  isCreateGroupSheetOpen: boolean;
  setIsCreateGroupSheetOpen: any;
}

function CreateGroupSheet(props: Props) {
  const chatState = ChatState();
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [errorText, setErrorText] = useState("");

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
          const dataWithoutGroups = res.data.chats.filter(
            (chat: Chat) => !chat.isGroupChat
          );
          setSearchData({ chats: dataWithoutGroups, user: null });
        } else {
          setSearchData(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [searchValue]);

  const handleCreateGroup = async (e: any) => {
    if (groupName.length < 3) {
      setErrorText("Group name shold be at least 3 characters");
      return;
    }

    if (groupUsers.length < 1) {
      setErrorText("You need to add at least 1 user to create a group");
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
      setErrorText("");
      props.setIsCreateGroupSheetOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sheet
      open={props.isCreateGroupSheetOpen}
      onOpenChange={props.setIsCreateGroupSheetOpen}
    >
      <SheetContent
        side="left"
        className="w-screen max-w-none sm:max-w-none md:w-4/12"
      >
        <SheetHeader>
          <SheetTitle>New Group Chat</SheetTitle>
        </SheetHeader>
        <div className="mt-5">
          {errorText.length !== 0 && (
            <p className="text-destructive italic mb-4">{errorText}</p>
          )}
          <form>
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
              className="my-4"
            />
            <div className="flex flex-wrap gap-2 mb-4">
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
                    onClick={() => {
                      setSearchValue("");
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
                      });
                    }}
                    className="mb-4 cursor-pointer"
                  >
                    <UserCard user={getSender(chatState?.user, chat.users)} />
                  </div>
                ))
              ) : searchData?.user ? (
                <div>
                  <UserCard user={searchData.user} />
                </div>
              ) : (
                <p className="mb-4 italic text-muted-foreground">No results</p>
              )}
            </div>
          </form>
        </div>
        <Button className="w-full" onClick={handleCreateGroup}>
          Create Group
        </Button>
      </SheetContent>
    </Sheet>
  );
}

export default CreateGroupSheet;
