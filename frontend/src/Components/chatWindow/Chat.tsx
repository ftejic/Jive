import { Button } from "../ui/button";
import { PaperPlaneIcon, FaceIcon, ImageIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { useEffect, useRef, useState } from "react";
import Messages from "./Messages";
import { socket } from "../../socket";
import useAutosizeTextArea from "../../config/autoSizeTextArea";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import SendImage from "./SendImage";

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
}

interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: ChatInterface;
  updatedAt: string;
  isImage: boolean;
}

interface ChatInterface {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: Message;
  sender?: User;
  image: string;
  updatedAt: string;
}

function Chat() {
  const chatState = ChatState();
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, message);

  const fetchMessages = async () => {
    if (!chatState?.selectedChat) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${chatState.selectedChat._id}`,
        {
          withCredentials: true,
        }
      );
      chatState.setMessages(data);
    } catch (error) {
      console.log("Fetching messages failed!");
    }
  };

  const handleSendMessage = async () => {
    if (message.length > 0) {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/message/",
          { content: message, chat: chatState?.selectedChat?._id },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setMessage("");
        socket.emit("new message", data);
        chatState?.setMessages((prev: Message[]) => [...prev, data]);
        if (chatState?.chats) {
          const chats = [...chatState.chats];
          const indexOfChat = chats.findIndex((c) => c._id === data.chat._id);
          chats[indexOfChat].latestMessage = data;

          const updatedChat = chats.splice(indexOfChat, 1)[0];
          chats.unshift(updatedChat);

          chatState?.setChats(chats);
        }
      } catch (error) {
        console.log(`Sending message Failed: ${error}`);
      }
    }
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(
    () => {
      fetchMessages();
    },
    chatState?.selectedChat ? [chatState?.selectedChat] : []
  );

  const onEmojiClick = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <>
      <Messages />
      {showPicker && (
        <div className="hidden md:block">
          <Picker
            data={data}
            onEmojiSelect={onEmojiClick}
            previewPosition="none"
            dynamicWidth="true"
            maxFrequentRows={1}
          />
        </div>
      )}
      <div className="flex justify-between gap-3 md:hidden px-1 pb-1 mt-1 md:mt-0">
        <div className="flex flex-1 bg-muted rounded-full px-3 gap-3">
          <div className="flex items-center h-9">
            <FaceIcon
              onClick={() => setShowPicker((val: boolean) => !val)}
              className="w-5 h-5 text-foreground cursor-pointer"
            />
          </div>
          <textarea
            rows={1}
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onEnterPress}
            placeholder="Type a message"
            className="outline-none resize-none w-full bg-transparent max-h-[136px] py-2 text-sm placeholder:text-muted-foreground"
          />
          <div className="flex items-center h-9">
            <label className="cursor-pointer">
            <div>
              <ImageIcon className="w-5 h-5 text-foreground" />
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>
          </div>
        </div>
        <Button
          onClick={handleSendMessage}
          className="bg-foreground rounded-full p-0 w-9 h-9 hover:bg-transparent"
        >
          <PaperPlaneIcon className="w-5 h-5 text-background" />
        </Button>
      </div>
      <div className="hidden md:flex items-end gap-3 p-3 bg-muted">
        <div className="flex items-center h-11">
          <FaceIcon
            onClick={() => setShowPicker((val: boolean) => !val)}
            className="w-6 h-6 text-foreground cursor-pointer"
          />
        </div>
        <div className="flex items-center h-11">
          <label className="cursor-pointer">
            <div>
              <ImageIcon className="w-6 h-6 text-foreground" />
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>
        </div>
        <div className="w-full flex items-end gap-3">
          <textarea
            rows={1}
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onEnterPress}
            placeholder="Type a message"
            className="outline-none resize-none w-full rounded-md bg-muted-foreground/20 max-h-[184px] px-3 py-3 text-sm placeholder:text-muted-foreground"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-transparent p-0 h-11 hover:bg-transparent"
          >
            <PaperPlaneIcon className="w-6 h-6 text-foreground" />
          </Button>
        </div>
      </div>
      {showPicker && (
        <div className="md:hidden mt-1">
          <Picker
            data={data}
            onEmojiSelect={onEmojiClick}
            previewPosition="none"
            dynamicWidth="true"
            maxFrequentRows={1}
          />
        </div>
      )}
      {image && <SendImage image={image} setImage={setImage} />}
    </>
  );
}

export default Chat;
