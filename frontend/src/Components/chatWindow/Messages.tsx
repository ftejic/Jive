import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ScrollableFeed from "react-scrollable-feed";
import ImagePreview from "./ImagePreview";

function Messages() {
  const chatState = ChatState();

  const [showFullMessage, setShowFullMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [clickedImage, setClickedImage] = useState("");

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
    <>
      <ScrollableFeed className="ScrollBar h-full py-2 px-4">
        {chatState?.messages &&
          chatState.messages.map((message, index) => {
            const isFirstMessage =
              index === 0 ||
              !chatState?.messages ||
              (index > 0 &&
                chatState.messages[index - 1]?.sender._id !==
                  message.sender._id);
            const isCurrentUser = message.sender._id === chatState?.user?._id;
            const shouldRenderAvatar =
              !isCurrentUser &&
              isFirstMessage &&
              (chatState?.selectedChat?.isGroupChat ||
                !chatState?.selectedChat);
            const isGroupChat = chatState?.selectedChat?.isGroupChat;
            const date = new Date(message.updatedAt);
            const lastDate =
              index > 0 && chatState?.messages
                ? new Date(chatState?.messages[index - 1].updatedAt)
                : null;
            let currentDate = new Date();
            let yesterday = new Date(currentDate);
            yesterday.setDate(yesterday.getDate() - 1);
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const shouldRenderDate =
              !lastDate || date.toDateString() !== lastDate.toDateString();

            return (
              <div key={message._id}>
                {shouldRenderDate && (
                  <p className="text-center my-5">
                    <span className="text-xs md:text-sm px-2 py-1 rounded-md bg-muted">
                      {date.getDate() === currentDate.getDate() &&
                      date.getMonth() === currentDate.getMonth() &&
                      date.getFullYear() === currentDate.getFullYear()
                        ? "Today"
                        : date.getDate() === yesterday.getDate() &&
                          date.getMonth() === yesterday.getMonth() &&
                          date.getFullYear() === yesterday.getFullYear()
                        ? "Yesterday"
                        : date.toLocaleDateString()}
                    </span>
                  </p>
                )}
                <div
                  className={`${
                    isFirstMessage ? "mt-3" : "mt-[2px]"
                  } flex items-${shouldRenderAvatar ? "start" : "center"}`}
                >
                  {shouldRenderAvatar && (
                    <Avatar className="w-7 h-7 mr-2">
                      <AvatarImage src={message.sender.image} />
                      <AvatarFallback className="bg-muted-foreground text-sm">
                        {message.sender.username[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {!message.isImage && (
                    <p
                      className={`${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      } ${
                        !isCurrentUser && !isFirstMessage && isGroupChat
                          ? "ml-9"
                          : ""
                      } ${
                        isGroupChat && !isCurrentUser ? "pt-1" : "pt-2"
                      } relative rounded-md pl-3 pr-[54px] pb-2 max-w-[75%] text-sm break-words`}
                    >
                      {(isFirstMessage || shouldRenderDate) && (
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
                      {isGroupChat && !isCurrentUser && isFirstMessage && (
                        <>
                          <span className="relative top-0 text-xs text-muted-foreground">
                            {message.sender.username}
                          </span>
                          <br />
                        </>
                      )}
                      {message.content.length > maxMessageLength
                        ? !showFullMessage
                          ? `${message.content.substring(
                              0,
                              maxMessageLength
                            )}... `
                          : `${message.content} `
                        : message.content}
                      {message.content.length > maxMessageLength ? (
                        !showFullMessage ? (
                          <span
                            className="underline text-blue-700 cursor-pointer"
                            onClick={() => setShowFullMessage(true)}
                          >
                            Read more
                          </span>
                        ) : (
                          <span
                            className="underline text-blue-700 cursor-pointer"
                            onClick={() => setShowFullMessage(false)}
                          >
                            Colapse
                          </span>
                        )
                      ) : (
                        ""
                      )}
                      <span className="absolute text-xs text-muted-foreground bottom-1 right-3">
                        {`${hours}:${minutes}`}
                      </span>
                    </p>
                  )}
                  {message.isImage && (
                    <p
                      onClick={() => {
                        setClickedImage(message.content);
                        setImagePreviewVisible(true);
                      }}
                      className={`${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      } ${
                        !isCurrentUser && !isFirstMessage && isGroupChat
                          ? "ml-9"
                          : ""
                      } ${
                        isGroupChat && !isCurrentUser ? "pt-1" : "pt-2"
                      } relative rounded-md px-2 pb-6 max-w-[75%] cursor-pointer`}
                    >
                      {(isFirstMessage || shouldRenderDate) && (
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
                      {isGroupChat && !isCurrentUser && isFirstMessage && (
                        <>
                          <span className="relative top-0 text-xs text-muted-foreground">
                            {message.sender.username}
                          </span>
                          <br />
                        </>
                      )}
                      <img
                        src={message.content}
                        alt="Image"
                        className="max-h-40 md:max-h-52"
                      />
                      <span className="absolute text-xs text-muted-foreground bottom-1 right-2">
                        {`${hours}:${minutes}`}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </ScrollableFeed>
      {imagePreviewVisible && (
        <ImagePreview
          clickedImage={clickedImage}
          setImagePreviewVisible={setImagePreviewVisible}
          setClickedImage={setClickedImage}
        />
      )}
    </>
  );
}

export default Messages;
