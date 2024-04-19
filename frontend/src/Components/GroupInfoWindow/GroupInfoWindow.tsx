import { ChatState } from "../../Context/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import GroupInfoWindowHeader from "./GroupInfoWindowHeader";

interface Props {
  groupInfoWindowVisible: boolean;
  setGroupInfoWindowVisible: any;
}

function GroupInfoWindow(props: Props) {
  const chatState = ChatState();

  return (
    <div
      className={`${
        props.groupInfoWindowVisible ? "flex" : "hidden"
      } flex-col col-start-1 md:col-start-5 lg:col-start-9 xl:col-start-10 col-end-13`}
    >
      <GroupInfoWindowHeader setGroupInfoWindowVisible={props.setGroupInfoWindowVisible}/>
      <ScrollArea>
        <div>
          <div className="flex flex-col items-center py-8 gap-5 border-b">
            <Avatar className="w-24 h-24 lg:w-48 lg:h-48">
              <AvatarImage src={chatState?.selectedChat?.sender?.image}/>
              <AvatarFallback className="text-5xl bg-muted-foreground">
                {
                  chatState?.selectedChat?.chatName[0]
                }
              </AvatarFallback>
            </Avatar>
            <p>{chatState?.selectedChat?.chatName}</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default GroupInfoWindow;
