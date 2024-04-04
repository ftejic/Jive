import { ChatState } from "../../Context/ChatProvider";
import ChatWindowHeader from "./ChatWindowHeader";

function ChatWindow() {
  const chatState = ChatState();
  return (
    <div
      className={`ChatWindow ${
        !chatState?.visible ? "block" : "hidden"
      } md:block col-start-1 col-end-13 md:col-start-5`}
    >
      {chatState?.selectedChat ? (
        <>
          <ChatWindowHeader />
        </>
      ) : (
        <div className="flex items-center h-full justify-center">Jive</div>
      )}
    </div>
  );
}

export default ChatWindow;
