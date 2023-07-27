import { addDoc, collection } from "firebase/firestore";
import { dbService, storageService } from "../firebase";
import { useRef, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { User } from "firebase/auth";
import { styled } from "styled-components";

const GweetFormContainer = styled.form`
  max-width: 300px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const InputGweet = styled.input`
  border: 1px solid white;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0);
  outline: none;
  padding: 20px 150px 20px 15px;
  text-align: left;
  color: white;
  font-size: 15px;
  margin: 12px 0;

  &::placeholder {
    color: white;
  }
`;

const GweetButton = styled.button<{ isLoading: boolean }>`
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid ${(props) => (props.isLoading ? "#ff7675" : "#74b9ff")};
  color: ${(props) => (props.isLoading ? "#ff7675" : "#74b9ff")};
  border-radius: 9999px;
  padding: 8px;
  position: absolute;
  top: 25px;
  right: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border: ${(props) => !props.isLoading && "1px solid white"};
    color: ${(props) => !props.isLoading && "white"};
    transition: all 0.3s ease;
  }
`;

const InputFile = styled.input`
  display: none;
`;

const InputFileLable = styled.label`
  color: #74b9ff;
  font-size: 15px;

  &:hover {
    color: white;
  }
`;

const FilePreviwBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 15px;
`;

const FilePreviw = styled.img`
  max-width: 150px;
  max-height: 150px;
  border-radius: 15px;
  border: 2px solid white;
`;

const FilePreviwCancelButton = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid white;
  color: white;
  padding: 8px 20px;
  border-radius: 15px;

  &:hover {
    border: 1px solid #74b9ff;
    color: #74b9ff;
  }
`;

export default function GweetForm({ userObj }: { userObj: User | null }) {
  const [gweet, setGweet] = useState("");
  const [file, setFile] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isLoading) return;

    e.preventDefault();
    setIsLoading(true);

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
      userName: userObj?.displayName ?? userObj?.email?.split("@")[0],
    };

    await addDoc(collection(dbService, "gweets"), newGweet);

    setIsLoading(false);

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
    <GweetFormContainer onSubmit={onSubmit}>
      <InputGweet
        value={gweet}
        onChange={onChange}
        type="text"
        placeholder="어떤 생각을 하고 있나요?"
        maxLength={120}
        required
      />
      <InputFileLable>
        + 사진 첨부하기
        <InputFile
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
      </InputFileLable>
      {file && (
        <FilePreviwBox>
          <FilePreviw src={file.toString()} />
          <FilePreviwCancelButton onClick={onClearPhoto}>
            지울래요
          </FilePreviwCancelButton>
        </FilePreviwBox>
      )}
      <GweetButton isLoading={isLoading} disabled={isLoading}>
        Gweet
      </GweetButton>
    </GweetFormContainer>
  );
}
