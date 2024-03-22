
function ChatWindow(props: any) {
  return (
    <div className={`${!props.visible ? "block" : "hidden"} md:block col-start-1 col-end-13 md:col-start-5`}>
      chatWindow
    </div>
  );
}

export default ChatWindow;
