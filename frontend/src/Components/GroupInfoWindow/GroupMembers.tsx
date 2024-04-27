import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserCard from "../MainPanel/UserCard";
import { Badge } from "../ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Input } from "../ui/input";
import axios from "axios";
import { getSender } from "../../config/chatLogics";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";

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

interface SearchData {
  chats: Chat[] | null;
  user: User | null;
}

interface Props {
  isAdmin: boolean | null | undefined;
  groupName: string;
}

function GroupMembers(props: Props) {
  const chatState = ChatState();
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [removeUserDialogVisible, setRemoveUserDialogVisible] = useState(false);
  const [makeAdminDialogVisible, setMakeAdminDialogVisible] = useState(false);

  const [clickedUser, setClickedUser] = useState<User | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        if (searchValue.length !== 0) {
          const { data } = await axios.post(
            "http://localhost:5000/api/chat/search",
            { searchTerm: searchValue },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          const filteredChats = data.chats.filter((chat: Chat) => {
            if (!chat.isGroupChat) {
              const isInGroup = chat.users.some((user) => {
                return chatState?.selectedChat?.users.includes(user);
              });
              return !isInGroup;
            }
            return false;
          });

          const filteredUsers =
            !data.user && chatState?.selectedChat?.users.includes(data.user)
              ? null
              : data.user;

          setSearchData({ chats: filteredChats, user: filteredUsers });
        } else {
          setSearchData(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [searchValue]);

  const addUserToGroup = async (userId: string) => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/group-add",
        {
          chatId: chatState?.selectedChat?._id,
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      chatState?.setSelectedChat(data);
      setSearchValue("");
      setSearchData(null);
    } catch (error) {
      console.log(error);
    }
  };

  const removeUserFromGroup = async () => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/group-remove",
        {
          chatId: chatState?.selectedChat?._id,
          userId: clickedUser?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      chatState?.setSelectedChat(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addAdmin = async () => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/group-add-admin",
        {
          chatId: chatState?.selectedChat?._id,
          userId: clickedUser?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      chatState?.setSelectedChat(data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/group-remove-admin",
        {
          chatId: chatState?.selectedChat?._id,
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      chatState?.setSelectedChat(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col py-10 border-b">
      <Input
        type="search"
        placeholder="Add Member"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="max-w-52 self-center mb-5"
      />
      <div>
        {!searchValue ? (
          <></>
        ) : searchData?.chats && searchData.chats.length !== 0 ? (
          searchData.chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() =>
                addUserToGroup(getSender(chatState?.user, chat.users)._id)
              }
              className="mb-4 px-4 cursor-pointer hover:bg-muted/30"
            >
              <UserCard user={getSender(chatState?.user, chat.users)} />
            </div>
          ))
        ) : searchData?.user ? (
          <div
            onClick={() => {
              searchData.user?._id && addUserToGroup(searchData?.user?._id);
            }}
          >
            <UserCard user={searchData.user} />
          </div>
        ) : (
          <p className="mb-4 px-4 italic text-muted-foreground">No results</p>
        )}
      </div>
      <p className="text-sm px-4 py-5 text-muted-foreground">
        {chatState?.selectedChat?.users.length} Members
      </p>
      <div>
        {chatState?.user && (
          <div className="relative px-4 cursor-default">
            {props.isAdmin && (
              <Badge
                variant="outline"
                className="absolute top-4 right-4 font-normal"
              >
                Admin
              </Badge>
            )}
            <UserCard user={chatState.user} />
          </div>
        )}
      </div>
      {chatState?.selectedChat?.users.map((user: User) => {
        const isUserAdmin = chatState?.selectedChat?.groupAdmins?.some(
          (admin) => admin._id === user._id
        );
        return (
          user._id !== chatState.user?._id &&
          (props.isAdmin ? (
            <ContextMenu key={user._id}>
              <ContextMenuTrigger>
                <div className="relative pl-4 pr-20 cursor-context-menu hover:bg-muted/30">
                  {isUserAdmin && (
                    <Badge
                      variant="outline"
                      className="absolute top-4 right-4 font-normal"
                    >
                      Admin
                    </Badge>
                  )}
                  <UserCard user={user} />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                {!isUserAdmin ? (
                  <ContextMenuItem
                    onClick={() => {
                      setClickedUser(user);
                      setMakeAdminDialogVisible(true);
                    }}
                  >
                    Make group admin
                  </ContextMenuItem>
                ) : (
                  <ContextMenuItem
                    onClick={() => {
                      removeAdmin(user._id);
                    }}
                  >
                    Dismiss as admin
                  </ContextMenuItem>
                )}
                <ContextMenuItem
                  onClick={() => {
                    setClickedUser(user);
                    setRemoveUserDialogVisible(true);
                  }}
                >
                  Remove
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ) : (
            <div key={user._id} className="relative pl-4 pr-20 cursor-context-menu hover:bg-muted/30">
              {isUserAdmin && (
                <Badge
                  variant="outline"
                  className="absolute top-4 right-4 font-normal"
                >
                  Admin
                </Badge>
              )}
              <UserCard user={user} />
            </div>
          ))
        );
      })}
      <AlertDialog
        open={removeUserDialogVisible}
        onOpenChange={setRemoveUserDialogVisible}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              Remove {clickedUser?.username} from "{props.groupName}" group?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeUserFromGroup()}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={makeAdminDialogVisible}
        onOpenChange={setMakeAdminDialogVisible}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              Make {clickedUser?.username} an admin for "{props.groupName}"
              group?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => addAdmin()}>
              Make group admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default GroupMembers;
