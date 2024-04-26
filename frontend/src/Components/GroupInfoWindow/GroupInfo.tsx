import { CheckIcon, Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import { Input } from "../ui/input";

interface Props {
    groupName: string;
    setGroupName: any;
    isAdmin: boolean | undefined | null;
}

function GroupInfo(props: Props) {
    const chatState = ChatState();
    const [renameVisible, setRenameVisible] = useState(false);

  const changeGroupName = async () => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/group-rename",
        {
          chatId: chatState?.selectedChat?._id,
          chatName: props.groupName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      chatState?.setSelectedChat(data);
      setRenameVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center py-8 gap-5 border-b">
        <Avatar className="w-24 h-24 lg:w-48 lg:h-48">
          <AvatarImage src={chatState?.selectedChat?.sender?.image} />
          <AvatarFallback className="text-5xl bg-muted-foreground">
            {chatState?.selectedChat?.chatName
              ? chatState?.selectedChat?.chatName[0]
              : ""}
          </AvatarFallback>
        </Avatar>
        {props.isAdmin ? (
          renameVisible ? (
            <div className="relative">
              <Input
                type="text"
                value={props.groupName}
                onChange={(e) => props.setGroupName(e.target.value)}
                className="pr-[52px]"
              />
              <div className="flex absolute top-2 right-3">
                <Cross2Icon
                  className="w-5 h-5 text-foreground"
                  onClick={() => {
                    chatState?.selectedChat?.chatName &&
                      props.setGroupName(chatState?.selectedChat?.chatName);
                    setRenameVisible(false);
                  }}
                />
                <CheckIcon
                  className="w-5 h-5 text-foreground"
                  onClick={() => changeGroupName()}
                />
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-2"
              onClick={() => setRenameVisible(true)}
            >
              <p>{props.groupName}</p>
              <Pencil1Icon className="w-5 h-5 text-foreground" />
            </div>
          )
        ) : (
          <p>{props.groupName}</p>
        )}
      </div>
    </div>
  );
}

export default GroupInfo;
