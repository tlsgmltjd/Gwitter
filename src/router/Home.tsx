import { useEffect, useState } from "react";
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
`;

const GweetsContainer = styled.div`
  width: 100%;
`;

const GweetsBox = styled.div`
  max-width: 550px;
  margin: 0 auto;
`;

export default function Home({ userObj }: { userObj: User | null }) {
  const [gweets, setGweets] = useState<SnapshotData[]>([]);

  useEffect(() => {
    onSnapshot(collection(dbService, "gweets"), (snapshot) => {
      const gweetsArray: SnapshotData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const orderedGweets = gweetsArray.sort(
        (a, b) => b.createAt! - a.createAt!
      );
      setGweets(orderedGweets);
    });
  }, []);

  return (
    <HomeContainer>
      <GweetForm userObj={userObj} />
      <GweetsContainer>
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
    </HomeContainer>
  );
}
