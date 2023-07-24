import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { useState } from "react";
import { authService } from "../firebase";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    Boolean(authService.currentUser)
  );

  return (
    <>
      <BrowserRouter>
        <Router isLoggedIn={isLoggedIn} />
      </BrowserRouter>
    </>
  );
}
