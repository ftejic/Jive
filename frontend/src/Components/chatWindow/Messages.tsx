import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ScrollableFeed from "react-scrollable-feed";

function Messages() {
  const chatState = ChatState();

  const [showFullMessage, setShowFullMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const maxMessageLengthDesktop = 750;
  const maxMessageLengthMobile = 500;

  useEffect(() => {
    const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(isMobileDevice);
  }, []);

  const maxMessageLength = isMobile
    ? maxMessageLengthMobile
    : maxMessageLengthDesktop;

  return (
    <ScrollableFeed className="ScrollBar h-full py-2 px-4">
      {chatState?.messages &&
        chatState.messages.map((message, index) => {
          const isFirstMessage =
            index === 0 ||
            !chatState?.messages ||
            (index > 0 &&
              chatState.messages[index - 1]?.sender._id !== message.sender._id);
          const isCurrentUser = message.sender._id === chatState?.user?._id;
          const shouldRenderAvatar =
            !isCurrentUser &&
            isFirstMessage &&
            (chatState?.selectedChat?.isGroupChat || !chatState?.selectedChat);
          const isGroupChat = chatState?.selectedChat?.isGroupChat;

          return (
            <div
              key={message._id}
              className={`${isFirstMessage ? "mt-3" : "mt-[2px]"} flex items-${
                shouldRenderAvatar ? "start" : "center"
              }`}
            >
              {shouldRenderAvatar && (
                <Avatar className="w-7 h-7 mr-2">
                  <AvatarImage src={message.sender.image} />
                  <AvatarFallback className="bg-muted-foreground text-sm">
                    {message.sender.username[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <p
                className={`${
                  isCurrentUser
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                } ${
                  !isCurrentUser && !isFirstMessage && isGroupChat ? "ml-9" : ""
                } relative rounded-md px-3 py-2 max-w-[75%] text-sm break-words`}
              >
                {isFirstMessage && (
                  <span
                    className={`${
                      isCurrentUser ? "-right-[6px]" : "-left-[6px]"
                    } absolute top-0`}
                  >
                    <svg
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="4 6 7 4.5"
                      width="16"
                      height="10.29"
                    >
                      <path
                        d="M4 6H11L7.5 10.5L4 6Z"
                        fill={`${
                          isCurrentUser
                            ? "hsl(210, 20%, 98%)"
                            : "hsl(215, 27.9%, 16.9%)"
                        }`}
                      ></path>
                    </svg>
                  </span>
                )}
                {message.content.length > maxMessageLength
                  ? !showFullMessage
                    ? `${message.content.substring(0, maxMessageLength)}... `
                    : message.content
                  : message.content}
                {message.content.length > maxMessageLength &&
                  !showFullMessage && <span className="underline text-blue-700 cursor-pointer" onClick={() => setShowFullMessage(true)}>Read more</span>}
              </p>
            </div>
          );
        })}
    </ScrollableFeed>
  );
}

export default Messages;
