import React, { useContext, useEffect, useState } from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { getEthereumContract } from "../common/contractfunction";
import { TwitterContext } from "../context/TwitterContext";

const style = {
  wrapper: `flex p-3 border-b border-[#38444d] w-[full]`,
  profileImage: `rounded-full h-[40px] w-[40px] object-cover`,
  postMain: `flex-1 relative`,
  headerDetails: `flex items-center`,
  name: `font-bold mr-1`,
  verified: `text-[0.8rem]`,
  handleAndTimeAgo: `text-[#8899a6] ml-1`,
  tweet: `my-2`,
  image: `rounded-3xl`,
  footer: `flex justify-between mr-28 mt-4 text-[#8899a6]`,
  footerIcon: `rounded-full text-lg p-2`,
};

export default function CommentComponent({ PostId }: { PostId: any }) {
  const { getCurrentUserDetails } = useContext(TwitterContext);
  const [commentArray, setcommentArray] = useState([]);
  async function getCommentFromBlockchain(PostId: number) {
    const contract = getEthereumContract();
    const commentInfo = await contract.getCommentInfo(PostId);

    setcommentArray(commentInfo);
  }

  useEffect(() => {
    getCommentFromBlockchain(PostId);
  });

  return (
    <div className="flex-col p-2">
      {commentArray.map(({ userID, commentDescription }, index) => {
        return (
          <SignleComment
            UserId={userID}
            commentDescription={commentDescription}
            key={index}
          />
        );
      })}
    </div>
  );
}

function SignleComment({
  UserId,
  commentDescription,
  key,
}: {
  UserId: string;
  commentDescription: string;
  key: number;
}) {
  const { getIndividualUserDetails } = useContext(TwitterContext);
  const [UserDetails, setUserDetails] = useState<any>();
  async function getUserDetail() {
    const { isProfileImageNft, name, profileImage, walletAddress } =
      await getIndividualUserDetails(UserId);
    setUserDetails({
      userName: name,
      displayName:
        name === "Unnamed"
          ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(41)}`
          : name,
      isProfileImageNft,
      profileImage,
    });
  }

  useEffect(() => {
    getUserDetail();
  }, []);

  return (
    <div className="flex-col  border-b m-2" key={key}>
      <div className="flex gap-2">
        <img
          src={UserDetails?.profileImage}
          alt={UserDetails?.userName}
          className={
            UserDetails.isProfileImageNft
              ? `${style.profileImage} smallHex`
              : style.profileImage
          }
        />
        <span className={style.headerDetails}>
          <span className={style.name}>{UserDetails.displayName}</span>
          {UserDetails.isProfileImageNft && (
            <span className={style.verified}>
              <BsFillPatchCheckFill />
            </span>
          )}
          <span className={style.handleAndTimeAgo}>
            @{UserDetails.userName}
          </span>
        </span>
      </div>

      <div className="m-2">{commentDescription}</div>
    </div>
  );
}
