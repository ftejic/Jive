import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignInPage(props: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/sign-in",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      props.setCookie("jive.session-token", data.sessionToken, {maxAge: 8 * 60 * 60});

      alert("Login Successful");

      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error) {
      console.log(`Login Failed: ${error}`);
    }
  };

  return (
    <div className="SignInPage flex lg:items-center min-h-screen bg-text">
      <div className="container max-w-md mx-auto flex flex-col sm:gap-5 mt-28 lg:mt-0">
        <div className="sm:border sm:border-lightGray px-5 py-5">
          <h1 className="text-4xl font-bold mb-10 text-center text-background">
            Welcome Back
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none border border-background text-background placeholder:text-lightGray px-3 py-2"
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none border border-background text-background placeholder:text-lightGray px-3 py-2"
            />
            <input
              type="submit"
              value="Sign In"
              className="button-primary cursor-pointer"
            />
          </form>
        </div>
        <div className="flex justify-center gap-1 sm:border sm:border-lightGray px-5 sm:py-5">
          <p className="text-background">Don't have an account?</p>
          <Link to="/sign-up" className="font-medium text-secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
