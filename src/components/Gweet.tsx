import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "../firebase";
import React, { useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import { styled } from "styled-components";

type IGweetProp = {
  gweetObj: {
    createAt?: number;
    creatorId?: string;
    gweet?: string;
    id?: string;
    fileUrl?: string;
    userName?: string;
  };

  isOwner: boolean;
};

const GweetBox = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid white;
  padding: 10px 15px;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  position: relative;
`;

const EditButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 15px;
`;

const GweetName = styled.h4`
  position: absolute;
  margin-right: 15px;
  left: 15px;
  font-size: 13px;
`;

const GweetImg = styled.img`
  max-width: 100px;
  max-height: 70px;
  border-radius: 15px;
  border: 1px solid white;
`;

const GweetContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 15px;
`;

const EditButton = styled.button`
  border-radius: 8px;
  margin: 3px 0px 3px 0;
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid white;
  color: white;
  padding: 2px 5px;

  &:hover {
    border: 1px solid #74b9ff;
    color: #74b9ff;
  }
`;

const GweetText = styled.p`
  max-width: 50%;
  overflow: hidden;
  margin-left: 60px;
`;

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
    <GweetContainer>
      <GweetBox>
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
            <GweetName>{gweetObj.userName ?? "???"}</GweetName>
            <GweetText>{gweetObj.gweet}</GweetText>

            {isOwner && (
              <EditButtonBox>
                <EditButton onClick={onDeleteClick}>❌</EditButton>
                <EditButton onClick={toggleEditing}>✏️</EditButton>
              </EditButtonBox>
            )}
          </>
        )}
      </GweetBox>
      {gweetObj.fileUrl && <GweetImg src={gweetObj.fileUrl} />}
    </GweetContainer>
  );
}
