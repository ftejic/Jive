import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainPanel from "../Components/MainPanel/MainPanel";
import ChatWindow from "../Components/ChatWindow/ChatWindow";
import { ChatState } from "../Context/ChatProvider";

function HomePage(props: any) {
  const chatState = ChatState();
  const [visible, setVisible] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/user/check-auth",
          {
            withCredentials: true,
          }
        );

        chatState?.setUser(data.user);
      } catch (error) {
        console.log(error);
        navigate("/sign-in");
      }
    };
    getUser();
  }, [navigate]);

  return (
    <div className="HomePage max-w-screen-2xl h-screen mx-auto grid grid-cols-12">
      <MainPanel visible={visible} />
      <ChatWindow visible={visible} />
    </div>
  );
}

export default HomePage;
