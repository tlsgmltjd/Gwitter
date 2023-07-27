import { Route, Routes } from "react-router-dom";
import Auth from "../router/Auth";
import Home from "../router/Home";
import Navigation from "./Navigation";
import Profile from "../router/Profile";
import { User } from "firebase/auth";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #2d3436;
    color: white;
    a {
      text-decoration: none;
      color: white;
    }
    ul {
      list-style: none;
    }
  }
`;

export default function Router({
  userObj,
  isLoggedIn,
  refreshUser,
}: {
  userObj: User | null;
  isLoggedIn: boolean;
  refreshUser: () => void;
}) {
  return (
    <>
      <GlobalStyle />
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route
              path="/profile"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            />
          </>
        ) : (
          <>
            <Route path="/" element={<Auth />} />
          </>
        )}
      </Routes>
    </>
  );
}
