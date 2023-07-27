import { addDoc, collection } from "firebase/firestore";
import { dbService, storageService } from "../firebase";
import { useRef, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { User } from "firebase/auth";

export default function GweetForm({ userObj }: { userObj: User | null }) {
  const [gweet, setGweet] = useState("");
  const [file, setFile] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let fileUrl = "";

    if (file) {
      // file을 업로드 했을 때
      const fileRef = ref(storageService, `${userObj?.uid}/${uuid4()}`);
      const response = await uploadString(fileRef, file, "data_url");
      fileUrl = await getDownloadURL(response.ref);
    }

    const newGweet = {
      gweet,
      createAt: Date.now(),
      creatorId: userObj?.uid,
      fileUrl,
    };

    await addDoc(collection(dbService, "gweets"), newGweet);

    setGweet("");
    setFile("");
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
  );
}
