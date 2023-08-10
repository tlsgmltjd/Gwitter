import React, { useEffect, useState } from "react";
import { authService, dbService } from "../firebase";
import { useNavigate } from "react-router-dom";
import { User, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { styled } from "styled-components";

interface IGweet {
  createAt?: number;
  creatorId?: string;
  gweet?: string;
  id?: string;
  fileUrl?: string;
  userName?: string;
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px;
`;

const EditNameInput = styled.input`
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid white;
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
`;

const EditNameButton = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid white;
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: border 0.3s ease;

  &:hover {
    border: 1px solid #74b9ff;
    transition: border 0.3s ease;
  }
`;

const EditNameForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin: 10px;
`;

const LogoutButton = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid #ff7675;
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border: 1px solid #d63031;
    color: #d63031;
    transition: all 0.3s ease;
  }
`;

const MyGweetsContainer = styled.div`
  margin: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MyGweetTitle = styled.h4``;

const MyGweetList = styled.ul`
  padding: 0;
`;

const MyGweet = styled.li`
  text-align: center;
  border-radius: 8px;
  border: 1px solid white;
  max-width: 220px;
  margin: 10px;
  padding: 10px 15px;
  overflow: hidden;
`;

const MyGweetToggleButton = styled.button<{ myGweetToggle: boolean }>`
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid ${(props) => (props.myGweetToggle ? "#ff7675" : "#74b9ff")};
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ProfileControlBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 30px;
`;

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
  const [myGweetToggle, setMyGweetToggle] = useState(false);

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

    if (!displayName?.length) return;
    if (!/^[^\s]+$/.test(displayName))
      return alert("이름에 공백이 들어갈 수 없습니다!");
    if (displayName?.length > 9) return alert("8글자 이내로 입력해주세요!");
    if (!displayName) return alert("변경할 이름을 입력해주세요!");
    if (userObj?.displayName ?? userObj?.email?.split("@")[0] !== displayName) {
      await updateProfile(userObj!, { displayName: displayName });
      refreshUser();
      return alert("정상적으로 변경되었습니다!");
    }
  };

  return (
    <>
      <ProfileContainer>
        <ProfileControlBox>
          <span>이름 변경하기 ✏️</span>
          <EditNameForm onSubmit={onSubmit}>
            <EditNameInput
              type="text"
              placeholder="이름 수정"
              value={displayName}
              onChange={onChange}
              maxLength={8}
            />
            <EditNameButton>✏️</EditNameButton>
          </EditNameForm>
        </ProfileControlBox>
        <LogoutButton onClick={onLogOutClick}>로그아웃</LogoutButton>
        <MyGweetsContainer>
          <MyGweetTitle>내가 작성한 Gweet</MyGweetTitle>
          <MyGweetToggleButton
            myGweetToggle={myGweetToggle}
            onClick={() => {
              setMyGweetToggle((prev) => !prev);
            }}
          >
            🦋
          </MyGweetToggleButton>

          {myGweetToggle && (
            <MyGweetList>
              {myGweets.map((gweet) => (
                <MyGweet key={gweet.id}>{gweet.gweet}</MyGweet>
              ))}
            </MyGweetList>
          )}
        </MyGweetsContainer>
      </ProfileContainer>
    </>
  );
}
