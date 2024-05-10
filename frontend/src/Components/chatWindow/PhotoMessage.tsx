import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface Props {
  setClickedImage: any;
  setImagePreviewVisible: any;
  isCurrentUser: boolean;
  isFirstMessage: boolean;
  isGroupChat: boolean | undefined;
  shouldRenderDate: boolean;
  message: any;
  hours: string;
  minutes: string;
}

function PhotoMessage(props: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {!imageLoaded && (
        <Skeleton className="w-3/4 h-[50vh] rounded-md bg-muted" />
      )}
      <div
        onClick={() => {
          props.setClickedImage(props.message.content);
          props.setImagePreviewVisible(true);
        }}
        className={`${
          props.isCurrentUser
            ? "bg-primary text-primary-foreground ml-auto"
            : "bg-muted"
        } ${
          !props.isCurrentUser && !props.isFirstMessage && props.isGroupChat
            ? "ml-9"
            : ""
        } ${
          props.isGroupChat && !props.isCurrentUser ? "pt-1" : "pt-2"
        } relative rounded-md px-2 pb-6 max-w-[75%] cursor-pointer`}
      >
        {(props.isFirstMessage || props.shouldRenderDate) && (
          <span
            className={`${
              props.isCurrentUser ? "-right-[6px]" : "-left-[6px]"
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
                  props.isCurrentUser
                    ? "hsl(210, 20%, 98%)"
                    : "hsl(215, 27.9%, 16.9%)"
                }`}
              ></path>
            </svg>
          </span>
        )}
        {props.isGroupChat && !props.isCurrentUser && props.isFirstMessage && (
          <>
            <span className="relative top-0 text-xs text-muted-foreground">
              {props.message.sender.username}
            </span>
            <br />
          </>
        )}
        <img
          src={props.message.content}
          onLoad={() => setImageLoaded(true)}
          alt="Image"
          className="max-h-40 md:max-h-52"
        />
        <span className="absolute text-xs text-muted-foreground bottom-1 right-2">
          {`${props.hours}:${props.minutes}`}
        </span>
      </div>
    </>
  );
}

export default PhotoMessage;
