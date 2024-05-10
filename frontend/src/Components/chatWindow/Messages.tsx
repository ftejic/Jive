import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ScrollableFeed from "react-scrollable-feed";
import ImagePreview from "./ImagePreview";
import Message from "./Message";
import PhotoMessage from "./PhotoMessage";

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
      <ScrollableFeed className="ScrollBar ScrollableFeed h-full py-2 px-4">
        {chatState?.messages &&
          chatState.messages.map((message, index) => {
            const isFirstMessage =
              index === 0 ||
              !chatState.messages ||
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
                    <Message
                      message={message}
                      isGroupChat={isGroupChat}
                      isCurrentUser={isCurrentUser}
                      isFirstMessage={isFirstMessage}
                      maxMessageLength={maxMessageLength}
                      showFullMessage={showFullMessage}
                      setShowFullMessage={setShowFullMessage}
                      shouldRenderDate={shouldRenderDate}
                      hours={hours}
                      minutes={minutes}
                    />
                  )}
                  {message.isImage &&
                    
                      <PhotoMessage 
                        message={message}
                        isFirstMessage={isFirstMessage}
                        isCurrentUser={isCurrentUser}
                        isGroupChat={isGroupChat}
                        setClickedImage={setClickedImage}
                        setImagePreviewVisible={setImagePreviewVisible}
                        shouldRenderDate={shouldRenderDate}
                        hours={hours}
                        minutes={minutes}
                      />
                    }
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
