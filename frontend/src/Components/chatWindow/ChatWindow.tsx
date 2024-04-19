import { ChatState } from "../../Context/ChatProvider";
import Chat from "./Chat";
import ChatWindowHeader from "./ChatWindowHeader";

interface Props {
  userInfoWindowVisible: boolean;
  groupInfoWindowVisible: boolean;
  setUserInfoWindowVisible: any;
  setGroupInfoWindowVisible: any;
}

function ChatWindow(props: Props) {
  const chatState = ChatState();
  return (
    <div
      className={`ChatWindow ${
        props.userInfoWindowVisible || props.groupInfoWindowVisible
          ? "hidden"
          : !chatState?.visible
          ? "flex"
          : "hidden"
      } lg:flex flex-col col-start-1 col-end-13 ${
        props.userInfoWindowVisible || props.groupInfoWindowVisible
          ? "md:border-r md:hidden lg:col-end-9 xl:col-end-10"
          : "md:flex md:col-end-13"
      } md:col-start-5 max-h-screen`}
    >
      {chatState?.selectedChat ? (
        <>
          <ChatWindowHeader
            setUserInfoWindowVisible={props.setUserInfoWindowVisible}
            setGroupInfoWindowVisible={props.setGroupInfoWindowVisible}
          />
          <Chat />
        </>
      ) : (
        <div className="flex items-center h-full justify-center">Jive</div>
      )}
    </div>
  );
}

export default ChatWindow;
