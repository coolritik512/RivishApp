import React, { useContext, useEffect, useState } from "react";
import { getEthereumContract } from "../common/contractfunction";
import { TwitterContext } from "../context/TwitterContext";
import ShortUserProfileComponent from "./profile/shortUserProfileComponent";

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
  const [commentArray, setcommentArray] = useState([]);

  async function getCommentFromBlockchain(PostId: number) {
    const contract = getEthereumContract();
    const commentInfo = await contract.getCommentInfo(PostId);
    setcommentArray(commentInfo);
  }

  useEffect(() => {
    getCommentFromBlockchain(PostId);
  }, []);

  return (
    <div className="flex-col p-2">
      {commentArray.map(({ userID, commentDescription }, index) => {
        return (
          <SignleComment
            UserId={userID}
            commentDescription={commentDescription}
            index={index}
          />
        );
      })}
    </div>
  );
}

function SignleComment({
  UserId,
  commentDescription,
  index,
}: {
  UserId: string;
  commentDescription: string;
  index: number;
}) {
  const { getIndividualUserDetails } = useContext(TwitterContext);
  const [UserDetails, setUserDetails] = useState<any>();

  async function getUserDetail() {
    const { isProfileImageNft, name, profileImage, walletAddress } =
      await getIndividualUserDetails(UserId);
    setUserDetails({
      userName: walletAddress,
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
    <div className="flex-col  border-b m-2" key={index}>
      <div className="flex gap-2">
        <ShortUserProfileComponent
          userName={UserDetails?.userName}
          displayName={UserDetails?.displayName}
          isProfileImageNft={UserDetails?.isProfileImageNft}
          profileImageLink={UserDetails?.profileImage}
        />
      </div>
      <div className="m-2">{commentDescription}</div>
    </div>
  );
}
