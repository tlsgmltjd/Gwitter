import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { useEffect, useState } from "react";
import { authService } from "../firebase";
import { Helmet } from "react-helmet";
import { User } from "firebase/auth";

export default function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userObj, setUserObj] = useState<User | null>(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Helmet>
          <title>Gwitter</title>
        </Helmet>
        {init ? (
          <Router userObj={userObj} isLoggedIn={isLoggedIn} />
        ) : (
          "Loading.."
        )}
      </BrowserRouter>
    </>
  );
}
