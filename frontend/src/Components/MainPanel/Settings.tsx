import { useRef, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Input } from "../ui/input";
import {
  CheckIcon,
  Cross2Icon,
  Pencil1Icon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import axios from "axios";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { firebaseStorage } from "../../firebase";

interface Props {
  isSettingsOpen: boolean;
  setIsSettingsOpen: any;
}

function Settings(props: Props) {
  const chatState = ChatState();
  const [username, setUsername] = useState("");
  const [renameVisible, setRenameVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const changeUsername = async () => {
    if (username.length > 3) {
      if (username !== chatState?.user?.username) {
        const { data } = await axios.patch(
          "http://localhost:5000/api/user/change-username",
          {
            username,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        chatState?.setUser(data);
        setUsername("");
        setRenameVisible(false);
      }
      setUsername("");
      setRenameVisible(false);
      setError("");
    } else {
      setError("Username must be at least 4 characters.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
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
            if (chatState?.user?.image && chatState.user.image.length > 0) {
              try {
                const deleteImageStorageRef = ref(
                  firebaseStorage,
                  chatState.user.image
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
              "http://localhost:5000/api/user/change-profile-image",
              {
                image: downloadURL,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );

            chatState?.setUser(data);
            setImage(null);
          });
        }
      );
    }
  };

  const discardChanges = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Sheet open={props.isSettingsOpen} onOpenChange={props.setIsSettingsOpen}>
      <SheetContent
        side="left"
        className="w-screen max-w-none sm:max-w-none md:w-4/12"
      >
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-10">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-24 h-24 lg:w-48 lg:h-48">
                <AvatarImage
                  src={
                    image ? URL.createObjectURL(image) : chatState?.user?.image
                  }
                />
                <AvatarFallback className="text-5xl bg-muted-foreground">
                  {chatState?.user?.username[0]}
                </AvatarFallback>
              </Avatar>

              <label className="absolute bottom-0 right-0">
                <div className="bg-background w-8 h-8 lg:w-16 lg:h-16 rounded-full flex items-center justify-center cursor-pointer">
                  <UploadIcon className="w-6 h-6 lg:w-11 lg:h-11 text-foreground cursor-pointer" />
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
          <p className="text-base mt-10">Your username</p>
          {renameVisible ? (
            <div className="relative mt-2">
              <Input
                type="text"
                placeholder={chatState?.user?.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pr-[52px]"
              />
              <div className="flex absolute top-2 right-3">
                <Cross2Icon
                  className="w-5 h-5 text-foreground cursor-pointer"
                  onClick={() => {
                    setUsername("");
                    setRenameVisible(false);
                    setError("");
                  }}
                />
                <CheckIcon
                  className="w-5 h-5 text-foreground cursor-pointer"
                  onClick={() => changeUsername()}
                />
              </div>
              {error.length > 0 && (
                <p className="text-destructive italic">{error}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 mt-2">
              <p>{chatState?.user?.username}</p>
              <Pencil1Icon
                className="w-5 h-5 text-foreground cursor-pointer"
                onClick={() => setRenameVisible(true)}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Settings;
