import { Routes, Route } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import HomePage from "./Pages/HomePage";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import { createContext, useEffect } from "react";


function App() {
  const [cookie, setCookie] = useCookies(["jive.session-token"]); 

  return (
    <CookiesProvider>
      <div className="App text-lg bg-background">
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/sign-in"
            element={<SignInPage setCookie={setCookie} />}
          />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </div>
    </CookiesProvider>
  );
}

export default App;
