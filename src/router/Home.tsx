import React, { useEffect, useState } from "react";
import { dbService } from "../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

type SnapshotData = { gweet?: string; createAt?: number; id: string };

export default function Home() {
  const [gweet, setGweet] = useState("");
  const [gweets, setGweets] = useState<SnapshotData[]>([]);

  const getGweets = async () => {
    const querySnapshot = await getDocs(collection(dbService, "gweets"));

    querySnapshot.forEach((element) => {
      const gweetObject = {
        ...element.data(),
        id: element.id,
      };
      setGweets((prev: SnapshotData[]) => {
        return [gweetObject, ...prev];
      });
    });
  };

  useEffect(() => {
    getGweets();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addDoc(collection(dbService, "gweets"), {
      gweet,
      createAt: Date.now(),
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
