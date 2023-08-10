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
  }
`;

const GweetsBox = styled.div`
  max-width: 550px;
  margin: 0 auto;
`;

export default function Home({ userObj }: { userObj: User | null }) {
  const [gweets, setGweets] = useState<SnapshotData[]>([]);
  const gweetContainerRef = useRef<HTMLDivElement>(null);

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
    if (!gweetContainerRef.current) return;

    gweetContainerRef.current.scrollTop =
      gweetContainerRef.current.scrollHeight;

    console.log(gweetContainerRef.current.scrollHeight);
  }, []);

  useEffect(() => {
    if (!gweetContainerRef.current) return;

    gweetContainerRef.current.scrollTop =
      gweetContainerRef.current.scrollHeight;

    console.log(gweetContainerRef.current.scrollHeight);
  }, [gweets]);

  return (
    <HomeContainer>
      <GweetsContainer ref={gweetContainerRef}>
        <GweetsBox>
          {gweets.map((gweet) => (
            <Gweet
              key={gweet.id}
              gweetObj={gweet}
              isOwner={gweet.creatorId === userObj?.uid}
            />
          ))}
        </GweetsBox>
      </GweetsContainer>
      <GweetForm userObj={userObj} />
    </HomeContainer>
  );
}
