import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { useEffect, useState } from "react";
import { authService } from "../firebase";
import { Helmet } from "react-helmet";

export default function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
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
        {init ? <Router isLoggedIn={isLoggedIn} /> : "Loading.."}
      </BrowserRouter>
    </>
  );
}
