import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "../firebase";
import React, { useState } from "react";
import { deleteObject, ref } from "firebase/storage";

type IGweetProp = {
  gweetObj: {
    createAt?: number;
    creatorId?: string;
    gweet?: string;
    id?: string;
    fileUrl?: string;
  };

  isOwner: boolean;
};

export default function Gweet({ gweetObj, isOwner }: IGweetProp) {
  const [editing, setEditing] = useState(false);
  const [newGweet, setNewGweet] = useState(gweetObj.gweet);
  const onDeleteClick = async () => {
    const ok = confirm("정말 이 Gweet을 삭제하시겠습니까?");
    if (ok) {
      // delete gweet
      await deleteDoc(doc(dbService, `gweets/${gweetObj.id}`));
      if (gweetObj.fileUrl)
        await deleteObject(ref(storageService, gweetObj.fileUrl));
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateDoc(doc(dbService, `gweets/${gweetObj.id}`), {
      gweet: newGweet,
    });
    setEditing(false);
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;

    setNewGweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Gweet을 수정해보세요"
                  value={newGweet}
                  onChange={onChange}
                  required
                />
                <button>확인</button>
              </form>
              <button onClick={toggleEditing}>취소</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{gweetObj.gweet}</h4>
          {gweetObj.fileUrl && (
            <img src={gweetObj.fileUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>지우기</button>
              <button onClick={toggleEditing}>수정하기</button>
            </>
          )}
        </>
      )}
    </div>
  );
}
