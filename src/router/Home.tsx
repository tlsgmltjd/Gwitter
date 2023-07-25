import React, { useState } from "react";

export default function Home() {
  const [Gweet, setGweet] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          value={Gweet}
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
