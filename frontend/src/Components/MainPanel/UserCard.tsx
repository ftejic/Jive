import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface User {
  _id: string;
  email: string;
  username: string;
  image: string;
}

interface Props {
  user: User;
  textVisible?: boolean;
}

function UserCard(props: Props) {
  return (
    <div className="flex items-center gap-4 px-4">
      <Avatar className={`h-10 w-10 xl:h-${props.textVisible ? '14' : '10'} xl:w-${props.textVisible ? '14' : '10'}`}>
        <AvatarImage src={props.user.image} alt="Avatar" />
        <AvatarFallback>{props.user.username[0]}</AvatarFallback>
      </Avatar>
      <div className="w-full border-b py-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium leading-none">{props.user.username}</p>
          {
            props.textVisible && <p className="text-sm text-muted-foreground">Start a chat</p>
          }
          
        </div>
      </div>
    </div>
  );
}

export default UserCard;
