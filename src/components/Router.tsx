import { Route, Routes } from "react-router-dom";
import Auth from "../router/Auth";
import Home from "../router/Home";
import Navigation from "./Navigation";
import Profile from "../router/Profile";
import { User } from "firebase/auth";

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
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route
              path="/profile"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            />
            <Route path="*" element={<h1>404</h1>} />
          </>
        ) : (
          <>
            <Route path="/" element={<Auth />} />
          </>
        )}
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}
