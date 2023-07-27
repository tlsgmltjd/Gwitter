import { Route, Routes } from "react-router-dom";
import Auth from "../router/Auth";
import Home from "../router/Home";
import Navigation from "./Navigation";
import Profile from "../router/Profile";
import { User } from "firebase/auth";

export default function Router({
  userObj,
  isLoggedIn,
}: {
  userObj: User | null;
  isLoggedIn: boolean;
}) {
  return (
    <>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route path="/profile" element={<Profile userObj={userObj} />} />
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
