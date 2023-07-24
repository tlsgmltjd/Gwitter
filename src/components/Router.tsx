import { Route, Routes } from "react-router-dom";
import Auth from "../router/Auth";
import Home from "../router/Home";
import Navigation from "./Navigation";
import Profile from "../router/Profile";

export default function Router({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
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
