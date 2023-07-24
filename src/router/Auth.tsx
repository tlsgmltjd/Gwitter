/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { authService, firebaseInstance } from "../firebase";
import React, { useState } from "react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let data;

      if (newAccount) {
        // create account
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        // log in
        data = await signInWithEmailAndPassword(authService, email, password);
      }

      console.log(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount((pre) => !pre);
  };

  const onSocialClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = e;

    let provider;

    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (!provider) return;

    const data = await signInWithPopup(authService, provider);

    console.log(data);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
        <button>{newAccount ? "가입하기" : "로그인하기"}</button>
        {error}
      </form>
      <button onClick={toggleAccount}>
        {newAccount ? "로그인 할래요" : "새로 가입 할래요"}
      </button>
      <div>
        <button onClick={onSocialClick} name="google">
          구글 계정으로 로그인 할래요
        </button>
      </div>
    </div>
  );
}
