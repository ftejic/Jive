import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import Chats from "./Chats";
import Header from "./Header";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

function MainPanel(props: any) {
  return (
    <div
      className={`${
        props.visible ? "flex" : "hidden"
      } md:flex flex-col col-start-1 col-end-13 md:col-end-5 max-h-screen`}
    >
      <Header />
      <form className="hidden md:block">
        <div className="relative px-3 py-3">
          <MagnifyingGlassIcon className="absolute w-5 h-5 top-5 left-6 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search or start new chat"
            className="pl-11 lg:pl-14"
          />
        </div>
      </form>
      <ScrollArea className="h-full border">
        <Chats />
      </ScrollArea>
    </div>
  );
}

export default MainPanel;
