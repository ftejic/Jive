import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { useEffect, useState } from "react";
import Messages from "./Messages";
import io from "socket.io-client";

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
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: Message;
  sender?: User;
}

let socket: any, selectedChatCompare: Chat | null | undefined;

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const chatState = ChatState();

  const formSchema = z.object({
    message: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const fetchMessages = async () => {
    if (!chatState?.selectedChat) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${chatState.selectedChat._id}`,
        {
          withCredentials: true,
        }
      );
      setMessages(data);

      socket.emit("join chat", chatState?.selectedChat?._id);
    } catch (error) {
      console.log("Fetching messages failed!");
    }
  };

  async function handleSendMessage(values: z.infer<typeof formSchema>) {
    const { message } = values;

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
      socket.emit("new message", data);
      setMessages((prev) => [...prev, data]);
      form.reset({ message: "" });
    } catch (error) {
      console.log(`Sending message Failed: ${error}`);
    }
  }

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = chatState?.selectedChat;
  }, chatState?.selectedChat ? [chatState?.selectedChat] : []);

  useEffect(() => {
    socket = io("http://localhost:5000");
    socket.emit("setup", chatState?.user);
    socket.on("connection", () => {setSocketConnected(true)})
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessage: Message) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
        // NOTIFICATION
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });
  
  return (
    <>
      <Messages messages={messages}/>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSendMessage)}
          className="flex w-full bg-muted py-3"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Type a message"
                    className="border-0 focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-transparent hover:bg-transparent">
            <PaperPlaneIcon className="w-6 h-6 text-foreground" />
          </Button>
        </form>
      </Form>
    </>
  );
}

export default Chat;
