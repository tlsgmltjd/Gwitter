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

  @media screen and (max-width: 600px) {
    font-size: 10px;
    padding: 5px 10px;
  }
`;

const GweetFileBox = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 15px;
  width: 300px;
  height: 200px;
  position: relative;
  font-size: 10px;

  @media screen and (max-width: 600px) {
    font-size: 10px;
    padding: 5px 10px;
  }
`;

const EditButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 15px;

  @media screen and (max-width: 600px) {
    flex-direction: row;
  }
`;

const GweetName = styled.h4`
  position: absolute;
  margin-right: 15px;
  left: 15px;
  font-size: 13px;

  @media screen and (max-width: 600px) {
    font-size: 10px;
  }
`;

const GweetImg = styled.img`
  max-width: 300px;
  max-height: 200px;
  border-radius: 15px;
  border: 1px solid white;
`;

const GweetContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 15px;
  position: relative;
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

  @media screen and (max-width: 600px) {
    padding: 6px 8px;
    margin: 0px 2px;
    font-size: 2px;
  }
`;

const GweetText = styled.p`
  max-width: 50%;
  overflow: hidden;
  margin-left: 60px;

  @media screen and (max-width: 600px) {
    margin-left: 40px;
  }
`;

const GweetTextMini = styled.p`
  max-width: 50%;
  overflow: hidden;
  font-size: 5px;
  opacity: 0.3;
`;

const GweetImgContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GweetEditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 5px;
`;

const GweetEditInput = styled.input`
  background-color: rgba(0, 0, 0, 0);
  color: white;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid white;
  outline: none;
`;

const GwettEditButton = styled.button`
  background-color: rgba(0, 0, 0, 0);
  color: white;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid white;

  &:hover {
    color: #74b9ff;
  }
`;

const GweetFileContentBox = styled.div`
  width: 100px;
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
    if (!newGweet?.length) return;
    if (newGweet?.length > 120) return alert("120자 이내로 수정해주세요!");
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
      {!gweetObj.fileUrl ? (
        <GweetBox>
          {editing ? (
            <>
              {isOwner && (
                <>
                  <GweetEditForm onSubmit={onSubmit}>
                    <GweetEditInput
                      type="text"
                      placeholder="Gweet을 수정해보세요"
                      value={newGweet}
                      onChange={onChange}
                      required
                    />
                    <GwettEditButton>확인</GwettEditButton>
                    <GwettEditButton onClick={toggleEditing}>
                      취소
                    </GwettEditButton>
                  </GweetEditForm>
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
      ) : (
        <GweetFileBox>
          {editing ? (
            <>
              {isOwner && (
                <>
                  <GweetEditForm onSubmit={onSubmit}>
                    <GweetEditInput
                      type="text"
                      placeholder="Gweet을 수정해보세요"
                      value={newGweet}
                      onChange={onChange}
                      required
                    />
                    <GwettEditButton>확인</GwettEditButton>
                    <GwettEditButton onClick={toggleEditing}>
                      취소
                    </GwettEditButton>
                  </GweetEditForm>
                </>
              )}
            </>
          ) : (
            <GweetFileContentBox>
              <GweetName>{gweetObj.userName ?? "???"}</GweetName>

              {isOwner && (
                <EditButtonBox>
                  <EditButton onClick={onDeleteClick}>❌</EditButton>
                  <EditButton onClick={toggleEditing}>✏️</EditButton>
                </EditButtonBox>
              )}
            </GweetFileContentBox>
          )}
        </GweetFileBox>
      )}
      {gweetObj.fileUrl && (
        <GweetImgContainer>
          <GweetImg src={gweetObj.fileUrl} />
          <GweetTextMini>{gweetObj.gweet}</GweetTextMini>
        </GweetImgContainer>
      )}
    </GweetContainer>
  );
}
