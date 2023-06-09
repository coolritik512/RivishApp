import React, { FormEvent, useContext, useEffect } from "react";
import { saveComment, getEthereumContract } from "../common/contractfunction";
import { TwitterContext } from "../context/TwitterContext";

type commentBoxPropType = {
  PostId: number;
  hidden: boolean;
  sethidden: Function;
};

const style = {
  container:
    "w-[50vw] h-[300px] border-neutral-300 border bg-black rounded-3xl p-2 flex-cols",
  Form: "grid gap-2 grid-rows-[2fr,0.5fr] w-full h-full",
  Textarea: "w-full h-full text-slate-800 text-2xl rounded-3xl p-2 resize-none",
  commentButton: "bg-blue-500 rounded-3xl w-full h-full text-white",
};

export default function CommentBox({ PostId, hidden, sethidden, }: commentBoxPropType) {
  const { currentUser } = useContext(TwitterContext);
  async function Comment(event: FormEvent, PostId: number) {
    event.preventDefault();

    const {
      comment: { value: comment },
    }: any = event.target;
    const contract = getEthereumContract();

    await contract.saveComment(PostId, currentUser.walletAddress, comment);
    sethidden(!hidden);
  }
  return (
    <div className={hidden ? "hidden" : style.container}>
      <form className={style.Form} onSubmit={(e) => Comment(e, PostId)}>
        <textarea id="comment" name="comment" className={style.Textarea} />
        <button className={style.commentButton} type="submit">
          Comment
        </button>
        <button
          className={style.commentButton + "text-white bg-red-600 rounded-3xl"}
          onClick={() => sethidden(!hidden)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
