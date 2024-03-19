interface Props {
  visible: boolean;
}

function ChatWindow(props: Props) {
  return (
    <div
      className={`
      ${!props.visible ? "block" : "hidden"} md:block
       h-full col-start-1 col-end-13 md:col-start-6 lg:col-start-5
      `}
    >
      chatWindow
    </div>
  );
}

export default ChatWindow;
