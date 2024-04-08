import { ChatState } from "../../Context/ChatProvider";
import Chat from "./Chat";
import ChatWindowHeader from "./ChatWindowHeader";


function ChatWindow() {
  const chatState = ChatState();
  return (
    <div
      className={`ChatWindow ${
        !chatState?.visible ? "flex" : "hidden"
      } md:flex flex-col col-start-1 col-end-13 md:col-start-5 max-h-screen`}
    >
      {chatState?.selectedChat ? (
        <>
          <ChatWindowHeader />
          <Chat />
        </>
      ) : (
        <div className="flex items-center h-full justify-center">Jive</div>
      )}
    </div>
  );
}

export default ChatWindow;
