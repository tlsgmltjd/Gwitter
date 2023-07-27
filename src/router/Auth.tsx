/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { authService } from "../firebase";
import React from "react";
import AuthForm from "../components/AuthForm";

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
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          구글 계정으로 로그인 할래요
        </button>
      </div>
    </div>
  );
}
