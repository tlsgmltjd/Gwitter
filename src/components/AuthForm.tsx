import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { authService } from "../firebase";
import { styled } from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  min-width: 300px;
  margin: 15px 0;
`;

const InputBox = styled.input`
  border-radius: 8px;
  text-align: center;
  padding: 12px 12px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  border: 1.5px solid gray;
  outline: none;
  color: white;
  transition: border 0.3s ease;

  &:hover {
    border: 1.5px solid #74b9ff;
    transition: border 0.3s ease;
  }
`;

const AuthButton = styled.button`
  border-radius: 15px;
  border: none;
  padding: 10px 80px;
  margin: 5px;
  background-color: white;
  color: #2d3436;
  font-size: 15px;
  cursor: pointer;
`;

const AuthChangeButton = styled(AuthButton)`
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
`;

const ErrorText = styled.span`
  color: #ff7675;
`;

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount((pre) => !pre);
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <InputBox
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <InputBox
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
        <AuthButton>{newAccount ? "가입하기" : "로그인하기"}</AuthButton>
        <ErrorText>{error}</ErrorText>
      </Form>
      <AuthChangeButton onClick={toggleAccount}>
        {newAccount ? "🔄 로그인 할래요" : "🔄 새로 가입 할래요"}
      </AuthChangeButton>
    </>
  );
}
