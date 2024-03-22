import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function ChatCard() {
  return (
    <div className="flex items-center gap-4 px-3">
      <Avatar className="h-10 w-10 xl:h-14 xl:w-14">
        <AvatarImage src="/avatars/02.png" alt="Avatar" />
        <AvatarFallback>J</AvatarFallback>
      </Avatar>
      <div className="flex justify-between w-full border-b py-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium leading-none">John Doe</p>
          <p className="text-sm text-muted-foreground">Example message</p>
        </div>     
        <div className="text-xs text-muted-foreground">19:34</div>
      </div>
      
    </div>
  );
}

export default ChatCard;
