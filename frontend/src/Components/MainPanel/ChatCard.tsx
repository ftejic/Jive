import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface User {
  _id: string;
  email: string;
  username: string;
  image: string;
}

interface Props {
  _id: string;
  chatName: string;
  sender?: User;
  latestMessage: string;
}

function ChatCard(props: Props) {

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-10 w-10 xl:h-14 xl:w-14">
        <AvatarImage src={props.sender?.image} alt="Avatar" />
        <AvatarFallback>{props.chatName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex justify-between w-full md:border-b py-4 md:py-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium leading-none">{props.chatName}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {props.latestMessage ? props.latestMessage : "Start a chat"}
          </p>
        </div>
        <div className="text-xs text-muted-foreground">19:34</div>
      </div>
    </div>
  );
}

export default ChatCard;
