import {
  CheckIcon,
  Cross2Icon,
  Pencil1Icon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { socket } from "../../socket";
import { Button } from "../ui/button";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { firebaseStorage } from "../../firebase";

interface Props {
  groupName: string;
  setGroupName: any;
  isAdmin: boolean | undefined | null;
}

function GroupInfo(props: Props) {
  const chatState = ChatState();
  const [renameVisible, setRenameVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const changeGroupName = async () => {
    try {
      const { data } = await axios.patch(
        `${process.env.REACT_APP_SERVERURL}/api/chat/group-rename`,
        {
          chatId: chatState?.selectedChat?._id,
          chatName: props.groupName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      socket.emit("group change", data);
      setRenameVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const discardChanges = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const saveChanges = async () => {
    if (image) {
      const name = new Date().getTime() + image.name;
      const storageRef = ref(firebaseStorage, `Group Images/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            if (
              chatState?.selectedChat?.image &&
              chatState.selectedChat.image.length > 0
            ) {
              try {
                const deleteImageStorageRef = ref(
                  firebaseStorage,
                  chatState.selectedChat.image
                );
                await deleteObject(deleteImageStorageRef);
                console.log("Previous image deleted from storage");
              } catch (error) {
                console.error(
                  "Error deleting previous image from storage:",
                  error
                );
              }
            }

            const { data } = await axios.patch(
              `${process.env.REACT_APP_SERVERURL}/api/chat/group-change-image`,
              {
                chatId: chatState?.selectedChat?._id,
                image: downloadURL,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );

            socket.emit("group change", data);
            setImage(null);
          });
        }
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center py-8 gap-5 border-b">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="w-24 h-24 lg:w-48 lg:h-48">
              <AvatarImage
                src={
                  image
                    ? URL.createObjectURL(image)
                    : chatState?.selectedChat?.image
                }
              />
              <AvatarFallback className="text-5xl bg-muted-foreground">
                {chatState?.selectedChat?.chatName
                  ? chatState?.selectedChat?.chatName[0]
                  : ""}
              </AvatarFallback>
            </Avatar>
            {props.isAdmin && (
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <div className="bg-background w-8 h-8 lg:w-16 lg:h-16 rounded-full flex items-center justify-center">
                  <UploadIcon className="w-6 h-6 lg:w-11 lg:h-11 text-foreground" />
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
            )}
          </div>
          {image && (
            <div>
              <Button className="mt-4 w-full" onClick={saveChanges}>
                Save Changes
              </Button>
              <Button
                variant={"outline"}
                className="mt-2 w-full"
                onClick={discardChanges}
              >
                Discard
              </Button>
            </div>
          )}
        </div>
        {props.isAdmin ? (
          renameVisible ? (
            <div className="relative">
              <Input
                type="text"
                value={props.groupName}
                onChange={(e) => props.setGroupName(e.target.value)}
                className="pr-[52px]"
              />
              <div className="flex absolute top-2 right-3">
                <Cross2Icon
                  className="w-5 h-5 text-foreground cursor-pointer"
                  onClick={() => {
                    chatState?.selectedChat?.chatName &&
                      props.setGroupName(chatState?.selectedChat?.chatName);
                    setRenameVisible(false);
                  }}
                />
                <CheckIcon
                  className="w-5 h-5 text-foreground cursor-pointer"
                  onClick={() => changeGroupName()}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p>{props.groupName}</p>
              <Pencil1Icon
                className="w-5 h-5 text-foreground cursor-pointer"
                onClick={() => setRenameVisible(true)}
              />
            </div>
          )
        ) : (
          <p>{props.groupName}</p>
        )}
      </div>
    </div>
  );
}

export default GroupInfo;
