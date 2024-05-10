interface Props {
  message: any;
  isCurrentUser: boolean;
  isFirstMessage: boolean;
  isGroupChat: boolean | undefined;
  shouldRenderDate: boolean;
  maxMessageLength: number;
  showFullMessage: boolean;
  setShowFullMessage: any;
  hours: string;
  minutes: string;
}

function Message(props: Props) {
  return (
    <p
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
      } relative rounded-md pl-3 pr-[54px] pb-2 max-w-[75%] text-sm break-words`}
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
      {props.message.content.length > props.maxMessageLength
        ? !props.showFullMessage
          ? `${props.message.content.substring(0, props.maxMessageLength)}... `
          : `${props.message.content} `
        : props.message.content}
      {props.message.content.length > props.maxMessageLength ? (
        !props.showFullMessage ? (
          <span
            className="underline text-blue-700 cursor-pointer"
            onClick={() => props.setShowFullMessage(true)}
          >
            Read more
          </span>
        ) : (
          <span
            className="underline text-blue-700 cursor-pointer"
            onClick={() => props.setShowFullMessage(false)}
          >
            Collapse
          </span>
        )
      ) : (
        ""
      )}
      <span className="absolute text-xs text-muted-foreground bottom-1 right-3">
        {`${props.hours}:${props.minutes}`}
      </span>
    </p>
  );
}

export default Message;
