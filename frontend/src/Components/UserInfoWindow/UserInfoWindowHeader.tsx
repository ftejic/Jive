import { Cross2Icon } from "@radix-ui/react-icons"

interface Props {
  setUserInfoWindowVisible: any;
}

function UserInfoWindowHeader(props: Props) {
  return (
    <div className="bg-background md:bg-muted border-b md:border-b-0 border-muted/30 py-3 px-4 flex items-center min-h-16 gap-5">
      <Cross2Icon width="20px" height="20px" cursor="pointer" onClick={() => props.setUserInfoWindowVisible(false)}/>
      <p>User Info</p>
    </div>
  )
}

export default UserInfoWindowHeader;