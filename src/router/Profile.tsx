import { useEffect } from "react";
import { authService, dbService } from "../firebase";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export default function Profile({ userObj }: { userObj: User | null }) {
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

  return (
    <>
      <button onClick={onLogOutClick}>로그아웃</button>
    </>
  );
}
