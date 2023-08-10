import { useEffect, useRef, useState } from "react";
import { dbService } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";
import Gweet from "../components/Gweet";
import GweetForm from "../components/GweetForm";
import { styled } from "styled-components";

export type SnapshotData = {
  gweet?: string;
  createAt?: number;
  id: string;
  creatorId?: string;
};

const HomeContainer = styled.main`
  width: 100%;
  height: 100%;
  margin-top: 50px;
`;

const GweetsContainer = styled.div`
  margin: 0 auto;
  width: 50%;
  max-height: 500px;
  overflow: scroll;
  border-radius: 15px;
  padding: 30px;
  background-color: #212728;

  @media screen and (max-width: 1100px) {
    width: 70%;
  }
  @media screen and (max-width: 600px) {
    width: 90%;
    max-height: 300px;
  }
`;

const GweetsBox = styled.div`
  max-width: 550px;
  margin: 0 auto;
`;

const LastGweet = styled.span`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px;
  opacity: 0.3;
`;

export default function Home({ userObj }: { userObj: User | null }) {
  const [gweets, setGweets] = useState<SnapshotData[]>([]);
  const [fristScroll, setFirstScroll] = useState(true);
  const gweetContainerRef = useRef<HTMLDivElement>(null);

  const scrollInit = () => {
    if (!gweetContainerRef.current) return;

    gweetContainerRef.current.scrollTop =
      gweetContainerRef.current.scrollHeight;
  };

  useEffect(() => {
    onSnapshot(collection(dbService, "gweets"), (snapshot) => {
      const gweetsArray: SnapshotData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const orderedGweets = gweetsArray.sort(
        (a, b) => a.createAt! - b.createAt!
      );
      setGweets(orderedGweets);
    });
  }, []);

  useEffect(() => {
    if (gweets.length === 0) return;
    if (fristScroll) {
      scrollInit();
      setFirstScroll(false);
    } else {
      if (!gweetContainerRef.current) return;

      const isScrolledToBottom =
        gweetContainerRef.current.scrollHeight -
          gweetContainerRef.current.clientHeight <=
        gweetContainerRef.current.scrollTop + 500; // 작은 오차를 허용

      if (!isScrolledToBottom) {
        return;
      }
      scrollInit();
    }
  }, [gweets]);

  return (
    <HomeContainer>
      <GweetsContainer ref={gweetContainerRef}>
        <GweetsBox>
          <LastGweet>더 이상 없어요...</LastGweet>
          {gweets.map((gweet) => (
            <Gweet
              key={gweet.id}
              gweetObj={gweet}
              isOwner={gweet.creatorId === userObj?.uid}
            />
          ))}
        </GweetsBox>
      </GweetsContainer>
      <GweetForm userObj={userObj} scrollInit={scrollInit} />
    </HomeContainer>
  );
}
