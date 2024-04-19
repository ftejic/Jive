import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainPanel from "../Components/MainPanel/MainPanel";
import ChatWindow from "../Components/ChatWindow/ChatWindow";
import { ChatState } from "../Context/ChatProvider";
import GroupInfoWindow from "../Components/GroupInfoWindow/GroupInfoWindow";
import UserInfoWindow from "../Components/UserInfoWindow/UserInfoWindow";

function HomePage() {
  const chatState = ChatState();
  const navigate = useNavigate();

  const [userInfoWindowVisible, setUserInfoWindowVisible] = useState(false);
  const [groupInfoWindowVisible, setGroupInfoWindowVisible] = useState(false);

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
      <MainPanel
        userInfoWindowVisible={userInfoWindowVisible}
        groupInfoWindowVisible={groupInfoWindowVisible}
        setUserInfoWindowVisible={setUserInfoWindowVisible}
        setGroupInfoWindowVisible={setGroupInfoWindowVisible}
      />
      <ChatWindow
        userInfoWindowVisible={userInfoWindowVisible}
        groupInfoWindowVisible={groupInfoWindowVisible}
        setUserInfoWindowVisible={setUserInfoWindowVisible}
        setGroupInfoWindowVisible={setGroupInfoWindowVisible}
      />
      <GroupInfoWindow
        groupInfoWindowVisible={groupInfoWindowVisible}
        setGroupInfoWindowVisible={setGroupInfoWindowVisible}
      />
      <UserInfoWindow
        userInfoWindowVisible={userInfoWindowVisible}
        setUserInfoWindowVisible={setUserInfoWindowVisible}
      />
    </div>
  );
}

export default HomePage;
