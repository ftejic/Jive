import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/user/sign-up",
        { username, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/sign-in");
      
    } catch (error) {
      console.log(`Signup Failed: ${error}`);
    }
  };

  return (
    <div className="SignUpPage flex lg:items-center min-h-screen bg-text">
      <div className="container max-w-md mx-auto flex flex-col sm:gap-5 mt-28 lg:mt-0">
        <div className="sm:border sm:border-lightGray px-5 py-5">
          <h1 className="text-4xl font-bold mb-10 text-center text-background">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="outline-none border border-background text-background placeholder:text-lightGray px-3 py-2"
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none border border-background text-background placeholder:text-lightGray px-3 py-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none border border-background text-background placeholder:text-lightGray px-3 py-2"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="outline-none border border-background text-background placeholder:text-lightGray px-3 py-2"
            />
            <input
              type="submit"
              value="Sign Up"
              className="button-primary cursor-pointer"
            />
          </form>
        </div>
        <div className="flex justify-center gap-1 sm:border sm:border-lightGray px-5 sm:py-5">
          <p className="text-background">Already have an account?</p>
          <Link to="/sign-in" className="font-medium text-secondary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
