import { Route, Routes } from "react-router-dom";
import Auth from "../router/Auth";
import Home from "../router/Home";

export default function Router({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />} />
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
