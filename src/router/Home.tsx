import React, { useEffect, useRef, useState } from "react";
import { dbService, storageService } from "../firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";
import Gweet from "../components/Gweet";
import { ref, uploadString } from "@firebase/storage";
import { v4 as uuid4 } from "uuid";

export type SnapshotData = {
  gweet?: string;
  createAt?: number;
  id: string;
  creatorId?: string;
};

export default function Home({ userObj }: { userObj: User | null }) {
  const [gweet, setGweet] = useState("");
  const [gweets, setGweets] = useState<SnapshotData[]>([]);
  const [file, setFile] = useState<string>();

  const fileInput = useRef<HTMLInputElement>(null);

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

    // await addDoc(collection(dbService, "gweets"), {
    //   gweet,
    //   createAt: Date.now(),
    //   creatorId: userObj?.uid,
    // });

    // setGweet("");

    if (!file) return;

    const fileRef = ref(storageService, `${userObj?.uid}/${uuid4()}`);
    const response = await uploadString(fileRef, file, "data_url");
    console.log(response);
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;

    setGweet(value);
  };

  const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = e;

    if (!files) return;
    const File = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const { result } = reader;
      setFile(result?.toString());
    };
    reader.readAsDataURL(File);
  };

  const onClearPhoto = () => {
    if (fileInput.current) {
      fileInput.current.value = "";
    }
    setFile("");
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
          required
        />
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        {file && (
          <div>
            <img src={file.toString()} width="50px" height="50px" />
            <button onClick={onClearPhoto}>지울래요</button>
          </div>
        )}
        <button>Gweet</button>
      </form>
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
