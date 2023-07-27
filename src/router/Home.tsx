import { useEffect, useState } from "react";
import { dbService } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";
import Gweet from "../components/Gweet";
import GweetForm from "../components/GweetForm";

export type SnapshotData = {
  gweet?: string;
  createAt?: number;
  id: string;
  creatorId?: string;
};

export default function Home({ userObj }: { userObj: User | null }) {
  const [gweets, setGweets] = useState<SnapshotData[]>([]);

  useEffect(() => {
    onSnapshot(collection(dbService, "gweets"), (snapshot) => {
      const gweetsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGweets(gweetsArray);
    });
  }, []);

  return (
    <div>
      <GweetForm userObj={userObj} />
      <div>
        {gweets.map((gweet) => (
          <Gweet
            key={gweet.id}
            gweetObj={gweet}
            isOwner={gweet.creatorId === userObj?.uid}
          />
        ))}
      </div>
    </div>
  );
}
