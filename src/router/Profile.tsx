import React, { useEffect, useState } from "react";
import { authService, dbService } from "../firebase";
import { useNavigate } from "react-router-dom";
import { User, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export default function Profile({
  userObj,
  refreshUser,
}: {
  userObj: User | null;
  refreshUser: () => void;
}) {
  const [displayName, setDisplayName] = useState(
    userObj?.displayName ?? userObj?.email?.split("@")[0]
  );

  const navigate = useNavigate();

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const getMyGweet = async () => {
    const q = query(
      collection(dbService, "gweets"),
      where("creatorId", "==", `${userObj?.uid}`),
      orderBy("createAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  };

  useEffect(() => {
    getMyGweet();
  }, []);

  const onChange = (e: React.FormEvent<HTMLInputElement>) =>
    setDisplayName(e.currentTarget.value);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!displayName) return alert("변경할 이름을 입력해주세요!");
    if (userObj?.displayName ?? userObj?.email?.split("@")[0] !== displayName) {
      await updateProfile(userObj!, { displayName: displayName });
      refreshUser();
      return alert("정상적으로 변경되었습니다!");
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="이름 수정"
          value={displayName}
          onChange={onChange}
        />
        <button>확인</button>
      </form>
      <button onClick={onLogOutClick}>로그아웃</button>
    </>
  );
}
