import axios from "axios";
import { firebaseStorage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ChatState } from "../../Context/ChatProvider";
import { socket } from "../../socket";
import { Cross2Icon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useState } from "react";

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
  chat: Chat;
  updatedAt: string;
  isImage: boolean;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: Message;
  sender?: User;
  image: string;
  updatedAt: string;
}

interface Props {
  image: File | null;
  setImage: any;
}

function SendImage(props: Props) {
  const chatState = ChatState();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSendImage = async () => {
    if (props.image) {
      const name = new Date().getTime() + props.image.name;
      const storageRef = ref(firebaseStorage, `Chat Images/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, props.image);

      setProgress(0);
      setUploading(true);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            try {
              const { data } = await axios.post(
                "http://localhost:5000/api/message/",
                {
                  content: downloadURL,
                  chat: chatState?.selectedChat?._id,
                  isImage: true,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              );
              socket.emit("new message", data);
              chatState?.setMessages((prev: Message[]) => [...prev, data]);
              if (chatState?.chats) {
                const chats = [...chatState.chats];
                const indexOfChat = chats.findIndex(
                  (c) => c._id === data.chat._id
                );
                chats[indexOfChat].latestMessage = data;

                const updatedChat = chats.splice(indexOfChat, 1)[0];
                chats.unshift(updatedChat);

                chatState?.setChats(chats);
              }
            } catch (error) {
              console.log(error);
            }
            props.setImage(null);
            setProgress(0);
            setUploading(false);
          });
        }
      );
    }
  };

  return (
    <div className="flex flex-col justify-between w-screen h-screen absolute top-0 left-0 bg-background z-50">
      <div className="flex justify-end border-b">
        <Cross2Icon
          onClick={() => {
            props.setImage(null);
          }}
          className="w-5 h-5 text-foreground m-4 cursor-pointer"
        />
      </div>
      <div className="flex justify-center items-center">
        <img
          src={props.image ? URL.createObjectURL(props.image) : ""}
          alt="image"
          className="max-h-[calc(100vh-122px)] w-auto"
        />
      </div>
      <div className="relative flex justify-end p-4 border-t">
        {uploading && (
          <p className="absolute text-center w-full left-0">{`Sending - ${progress}%`}</p>
        )}
        <Button
          onClick={handleSendImage}
          className="bg-foreground rounded-full p-0 w-9 h-9 hover:bg-transparent z-50"
        >
          <PaperPlaneIcon className="w-5 h-5 text-background" />
        </Button>
      </div>
    </div>
  );
}

export default SendImage;
