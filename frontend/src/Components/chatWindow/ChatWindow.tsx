import { ChatState } from "../../Context/ChatProvider";

function ChatWindow(props: any) {
  const chatState = ChatState();
  return (
    <div
      className={`${
        !props.visible ? "block" : "hidden"
      } md:block col-start-1 col-end-13 md:col-start-5`}
    >
      {chatState?.selectedChat?.chatName}
    </div>
  );
}

export default ChatWindow;
