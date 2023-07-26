type IGweetProp = {
  gweetObj: {
    createAt?: number;
    creatorId?: string;
    gweet?: string;
    id?: string;
  };

  isOwner: boolean;
};

export default function Gweet({ gweetObj, isOwner }: IGweetProp) {
  return (
    <div>
      <h4>{gweetObj.gweet}</h4>
      {isOwner && (
        <>
          <button>지우기</button>
          <button>수정하기</button>
        </>
      )}
    </div>
  );
}
