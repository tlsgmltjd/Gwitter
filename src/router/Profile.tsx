import React, { useEffect, useState } from "react";
import { authService, dbService } from "../firebase";
import { useNavigate } from "react-router-dom";
import { User, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

interface IGweet {
  createAt?: number;
  creatorId?: string;
  gweet?: string;
  id?: string;
  fileUrl?: string;
  userName?: string;
}

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
  const [myGweets, setMyGweets] = useState<IGweet[]>([]);

  const navigate = useNavigate();

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const getMyGweet = async () => {
    const q = query(
      collection(dbService, "gweets"),
      where("creatorId", "==", `${userObj?.uid}`),
      orderBy("createAt", "asc")
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setMyGweets((prev) => {
        return [{ ...doc.data() }, ...prev];
      });
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
      <div>
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
        <div>
          <span>내가 작성한 Gweet</span>
          {myGweets.map((gweet) => (
            <div key={gweet.id}>{gweet.gweet}</div>
          ))}
        </div>
      </div>
    </>
  );
}
