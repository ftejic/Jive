import { Cross2Icon } from "@radix-ui/react-icons";

interface Props {
  setGroupInfoWindowVisible: any;
}

function GroupInfoWindowHeader(props: Props) {
  return (
    <div className="bg-muted py-3 px-4 flex items-center min-h-16 gap-5">
      <Cross2Icon
        width="20px"
        height="20px"
        cursor="pointer"
        onClick={() => props.setGroupInfoWindowVisible(false)}
      />
      <p>Group Info</p>
    </div>
  );
}

export default GroupInfoWindowHeader;
