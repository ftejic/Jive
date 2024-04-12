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
  users: User[];
  latestMessage: Message;
}

interface SearchData {
  chats: Chat[] | null;
  user: User | null;
}

function MainPanel() {
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [isCreateGroupSheetOpen, setIsCreateGroupSheetOpen] = useState(false);
  const chatState = ChatState();

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
          setSearchData(res.data);
        } else {
          setSearchData(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [searchValue]);

  return (
    <div
      className={`${
        chatState?.visible ? "flex" : "hidden"
      } md:flex flex-col col-start-1 col-end-13 md:col-end-5 max-h-screen`}
    >
      <Header
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setIsCreateGroupSheetOpen={setIsCreateGroupSheetOpen}
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
      <ScrollArea className="h-full border">
        {searchValue.length > 0 ? (
          <SearchResults
            searchData={searchData}
            setSearchValue={setSearchValue}
          />
        ) : (
          <Chats />
        )}
      </ScrollArea>
      <CreateGroupSheet
        isCreateGroupSheetOpen={isCreateGroupSheetOpen}
        setIsCreateGroupSheetOpen={setIsCreateGroupSheetOpen}
      />
    </div>
  );
}

export default MainPanel;
