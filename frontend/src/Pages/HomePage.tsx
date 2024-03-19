import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainPanel from "../Components/MainPanel/MainPanel";
import ChatWindow from "../Components/chatWindow/ChatWindow";


interface User {
  _id: String;
  username: String;
  email: String;
  image: String;
}

interface UserContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContext | null>(null);


function HomePage() {
  const [user, setUser] = useState<User | null>(null);
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

        setUser(data.user);

      } catch (error) {
        console.log(error);
        navigate("/sign-in");
      }
    };
    getUser();
  }, [navigate]);

  return (
    <div className="HomePage max-w-screen-2xl h-screen mx-auto grid grid-cols-12">
      <UserContext.Provider value={{user, setUser}}>
        <MainPanel visible={visible} />
        <ChatWindow visible={visible}/>
      </UserContext.Provider>
    </div>
  );
}

export default HomePage;
