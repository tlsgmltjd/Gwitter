import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { useEffect, useState } from "react";
import { authService } from "../firebase";
import { Helmet } from "react-helmet";
import { User, updateCurrentUser } from "firebase/auth";
import { styled, createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #2d3436;
    color: white;
    margin: 0;
    padding: 0;

    a {
      text-decoration: none;
      color: white;
    }
    ul {
      list-style: none;
    }
  }
  * {
    box-sizing: border-box;
  }
`;

const LoddingPage = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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

  const refreshUser = async () => {
    // 너무 큰 onject라서 리엑트가 렌더링 할지 결정장애가 옴
    await updateCurrentUser(authService, authService.currentUser);
    setUserObj(authService.currentUser);
  };

  return (
    <>
      <BrowserRouter>
        <GlobalStyle />
        <Helmet>
          <title>Gwitter</title>
        </Helmet>
        {init ? (
          <Router
            userObj={userObj}
            isLoggedIn={isLoggedIn}
            refreshUser={refreshUser}
          />
        ) : (
          <LoddingPage>로딩중..</LoddingPage>
        )}
      </BrowserRouter>
    </>
  );
}
