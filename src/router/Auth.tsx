/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { authService } from "../firebase";
import React from "react";
import AuthForm from "../components/AuthForm";
import { styled } from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const LogoText = styled.h1`
  color: white;
`;

const AccentText = styled.span`
  color: #74b9ff;
`;

const LoginBox = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const OAuthButton = styled.button`
  border-radius: 8px;
  border: 1px solid white;
  padding: 8px;
  padding: 10px 20px;
  margin: 5px;
  background-color: rgba(0, 0, 0, 0);
  color: white;
  font-size: 15px;
  margin-top: 25px;

  &:hover {
    border: 1px solid #74b9ff;
  }
`;

export default function Auth() {
  const onSocialClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = e;

    let provider;

    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (!provider) return;

    await signInWithPopup(authService, provider);
  };

  return (
    <Container>
      <LoginBox>
        <LogoText>
          <AccentText>G</AccentText>witter 🦋
        </LogoText>
        <AuthForm />
        <OAuthButton onClick={onSocialClick} name="google">
          구글 계정으로 로그인 할래요
        </OAuthButton>
      </LoginBox>
    </Container>
  );
}
