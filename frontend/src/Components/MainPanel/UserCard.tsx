import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface User {
  _id: string;
  email: string;
  username: string;
  image: string;
}

interface Props {
  user: User;
}

function UserCard(props: Props) {
  return (
    <div className="flex items-center gap-4 px-3">
      <Avatar className="h-10 w-10 xl:h-14 xl:w-14">
        <AvatarImage src={props.user.image} alt="Avatar" />
        <AvatarFallback>{props.user.username[0]}</AvatarFallback>
      </Avatar>
      <div className="w-full border-b py-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium leading-none">{props.user.username}</p>
          <p className="text-sm text-muted-foreground">Start a chat</p>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
