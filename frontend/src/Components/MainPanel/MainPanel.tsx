import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import Chats from "./Chats";
import Header from "./Header";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import axios from "axios";
import SearchResults from "./SearchResults";
import CreateGroupSheet from "./CreateGroupSheet";
import { ChatState } from "../../Context/ChatProvider";
import Settings from "./Settings";

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
  updatedAt: string;
  isImage: boolean;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  groupAdmins?: User[];
  users: User[];
  latestMessage: Message;
  image: string;
  updatedAt: string;
}

interface SearchData {
  chats: Chat[] | null;
  user: User | null;
}

interface Props {
  userInfoWindowVisible: boolean;
  groupInfoWindowVisible: boolean;
  setUserInfoWindowVisible: any;
  setGroupInfoWindowVisible: any;
}

function MainPanel(props: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isCreateGroupSheetOpen, setIsCreateGroupSheetOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const chatState = ChatState();

  useEffect(() => {
    const getData = async () => {
      try {
        if (searchValue.length !== 0) {
          const { data } = await axios.post(
            `${process.env.REACT_APP_SERVERURL}/api/chat/search`,
            { searchTerm: searchValue },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          setSearchData(data);
        } else {
          setSearchData(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [searchValue]);

  const getTime = (date: string | null): string | null => {
    if(!date) return null;
    let dateTime = new Date(date);
    let currentDate = new Date();

    if (
      dateTime.getDate() === currentDate.getDate() &&
      dateTime.getMonth() === currentDate.getMonth() &&
      dateTime.getFullYear() === currentDate.getFullYear()
    ) {
      return dateTime.toLocaleTimeString([], {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      var yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      if (
        dateTime.getDate() === yesterday.getDate() &&
        dateTime.getMonth() === yesterday.getMonth() &&
        dateTime.getFullYear() === yesterday.getFullYear()
      ) {
        return "yesterday";
      } else {
        return dateTime.toLocaleDateString();
      }
    }
  };

  return (
    <div
      className={`${
        props.userInfoWindowVisible || props.groupInfoWindowVisible
          ? "hidden"
          : chatState?.visible
          ? "flex"
          : "hidden"
      } md:flex flex-col col-start-1 col-end-13 md:col-end-5 max-h-screen`}
    >
      <Header
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setIsCreateGroupSheetOpen={setIsCreateGroupSheetOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        searchVisible={searchVisible}
        setSearchVisible={setSearchVisible}
      />
      <form className="hidden md:block border-x">
        <div className="relative px-4 py-3">
          <MagnifyingGlassIcon className="absolute w-5 h-5 top-5 left-7 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search or start new chat"
            className="pl-11 lg:pl-14"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </form>
      <ScrollArea className="h-full md:border">
        {searchValue.length > 0 ? (
          <SearchResults
            searchData={searchData}
            setSearchValue={setSearchValue}
            setUserInfoWindowVisible={props.setUserInfoWindowVisible}
            setGroupInfoWindowVisible={props.setGroupInfoWindowVisible}
            setSearchVisible={setSearchVisible}
            getTime={getTime}
          />
        ) : (
          <Chats
            setUserInfoWindowVisible={props.setUserInfoWindowVisible}
            setGroupInfoWindowVisible={props.setGroupInfoWindowVisible}
            getTime={getTime}
          />
        )}
      </ScrollArea>
      <CreateGroupSheet
        isCreateGroupSheetOpen={isCreateGroupSheetOpen}
        setIsCreateGroupSheetOpen={setIsCreateGroupSheetOpen}
      />
      <Settings
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />
    </div>
  );
}

export default MainPanel;
