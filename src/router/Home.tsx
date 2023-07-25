import React, { useEffect, useState } from "react";
import { dbService } from "../firebase";
import { addDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";

type SnapshotData = { gweet?: string; createAt?: number; id: string };

export default function Home({ userObj }: { userObj: User | null }) {
  const [gweet, setGweet] = useState("");
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addDoc(collection(dbService, "gweets"), {
      gweet,
      createAt: Date.now(),
      creatorId: userObj?.uid,
    });

    setGweet("");
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;

    setGweet(value);
  };

  console.log(gweets);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={gweet}
          onChange={onChange}
          type="text"
          placeholder="어떤 생각을 하고 있나요?"
          maxLength={120}
        />
        <button>Gweet</button>
      </form>
      <div>
        {gweets.map((gweet) => (
          <div key={gweet.id}>
            <h4>{gweet.gweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
