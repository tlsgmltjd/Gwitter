import React, { useState } from "react";
import { dbService } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function Home() {
  const [gweet, setGweet] = useState("");

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
    </div>
  );
}
