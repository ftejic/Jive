import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  _id: String;
  username: String;
  email: String;
  image: String;
}

function HomePage(props: any) {
  const [user, setUser] = useState<User | null>(null);

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

  return <div>{user?.username}</div>;
}

export default HomePage;
