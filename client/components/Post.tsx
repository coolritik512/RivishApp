import {
  BsChevronCompactLeft,
  BsChevronCompactRight,
  BsFillPatchCheckFill,
} from "react-icons/bs";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { FiShare } from "react-icons/fi";
import { format } from "timeago.js";
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import PageIndicator from "./pageIndicator";
import CommentBox from "./commentBox";
import { getEthereumContract } from "../common/contractfunction";
import { getNftProfileImage, TwitterContext } from "../context/TwitterContext";
import { Router, useRouter } from "next/router";
import ShortUserProfileComponent from "./profile/shortUserProfileComponent";
import Modal from "react-modal";
import { customStyles } from "../lib/constants";
import { client } from "../lib/client";

const style = {
  wrapper: `flex-col p-3 border-b border-[#38444d] w-[full]`,
  profileImage: `rounded-full h-[40px] w-[40px] object-cover`,
  postMain: `flex-1 relative`,
  headerDetails: `flex items-center`,
  name: `font-bold mr-1`,
  verified: `text-[0.8rem]`,
  handleAndTimeAgo: `text-[#8899a6] ml-1`,
  tweet: `my-2`,
  image: `rounded-3xl`,
  footer: `flex justify-between mr-28 mt-4 text-[#8899a6]`,
  footerIcon: ` flex items-center gap-2 rounded-full text-lg p-2 relative`,
};

interface PostProps {
  displayName: string;
  userName: string;
  text: {
    PostDescription: string;
    Images: [string];
    PostId: number;
  };
  avatar: string;
  timestamp: string;
  isProfileImageNft: Boolean | undefined;
  Title?: string;
  RePost?: string;
}

const Post = ({
  displayName,
  userName,
  text,
  avatar,
  timestamp,
  isProfileImageNft,
  Title,
  RePost
}: PostProps) => {
  const [hidden, sethidden] = useState<boolean>(true);
  const router = useRouter();
  const { PostDescription, PostId, Images } = text;
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  async function getCommentAndLikeCount(PostId: number) {
    const contract = getEthereumContract();
    const { _hex: comment } = await contract.getCommentCount(PostId);

    setCommentCount(parseInt(comment));
    const { _hex: like } = await contract.getLikesCount(PostId);
    setLikeCount(parseInt(like));
    // console.log(like, comment);
  }

  useEffect(() => {
    if (PostId != null) getCommentAndLikeCount(PostId);
  }, [PostId]);

  return (
    <div className={style.wrapper} key={PostId}>
      <ShortUserProfileComponent
        displayName={displayName}
        userName={userName}
        isProfileImageNft={isProfileImageNft}
        profileImageLink={avatar}
        timestamp={timestamp}
      />

      <div className={style.postMain} key={PostId + "post"}>
        <div>
          <div
            onClick={() => {
              router.push({ pathname: `/PostPage`, query: { PostId } });
            }}
            className={style.tweet}
          >
            {Title ? <div className=" text-blue-300">#{Title}</div> : null}
            {PostDescription}
          </div>
          {Images?.length > 0 ? (
            <PostImagesComponent images={text.Images} />
          ) : null}
        </div>
        <div className={style.footer}>
          <div
            className={`${style.footerIcon} hover:text-[#1d9bf0] hover:bg-[#1e364a]`}
          >
            <FaRegComment
              onClick={(e) => {
                e.preventDefault();
                sethidden(!hidden);
              }}
            />
            <span className="">{commentCount}</span>

            <Modal
              isOpen={!hidden}
              className={"max-w-fit top-48  translate-x-1/2 translate-y-1/2"}
            >
              <CommentBox
                hidden={false}
                PostId={text.PostId}
                sethidden={sethidden}
              />
            </Modal>
          </div>
          <RePostComponent PostId={text.PostId} ReTweet={RePost} />

          <LikeComponent PostId={text.PostId} likeCount={likeCount} />
        </div>
      </div>
    </div>
  );
};

function RePostComponent({
  PostId,
  ReTweet,
}: {
  PostId: number;
  ReTweet: number;
}) {

  const [RePostCount,setRePostCount]=useState(ReTweet??0);
  async function RePostToSanity(PostId:number) {
    await client.patch(`id${PostId}`).set({RePost:RePostCount+1}).commit();
  }
  async function RePost(PostId:number) {
    const contract = getEthereumContract();
    await contract.RePost(PostId);
    RePostToSanity(PostId);
    setRePostCount(RePostCount+1);
  }

  return (
    <div
      className={`${style.footerIcon} hover:text-[#03ba7c] hover:bg-[#1b393b]`}
    >
      <FaRetweet
        onClick={(e) => {
          e.preventDefault();
          RePost(PostId);
        }}
      />
      {RePostCount}
    </div>
  );
}

function LikeComponent({
  PostId,
  likeCount,
}: {
  PostId: number;
  likeCount: number;
}) {
  const { currentUser } = useContext(TwitterContext);

  const [liked, setLiked] = useState(false);

  async function checkLiked(PostId: number) {
    const contract = getEthereumContract();
    if (currentUser.walletAddress && PostId != undefined) {
      const li = await contract.checkLiked(PostId, currentUser.walletAddress);
      setLiked(li);
    }
  }

  async function LikePost(PostId: number) {
    const contract = getEthereumContract();

    if (liked == true) {
      await contract.unlikePost(PostId, currentUser.walletAddress);
      setLiked(false);
    } else {
      await contract.LikePost(PostId, currentUser.walletAddress);
      setLiked(true);
    }
  }
  useEffect(() => {
    if (currentUser) checkLiked(PostId);
  }, [currentUser]);

  return (
    <div
      className={`${style.footerIcon} ${
        liked ? "text-[#f91c80]" : ""
      } hover:bg-[#39243c]`}
    >
      <AiOutlineHeart
        onClick={(e) => {
          e.preventDefault();
          LikePost(PostId);
        }}
      />
      <span>{likeCount}</span>
    </div>
  );
}

function PostImagesComponent({ images }: { images: [string] }) {
  let [slideAmount, setslideAmount] = useState(0);
  const ImageCount = images.length;
  const [currentImage, setcurrentImage] = useState(0);

  function showPrev() {
    if (slider.current) {
      slideAmount = slideAmount + slider.current?.clientWidth;
      slider.current.style.transform = `translateX(${slideAmount}px)`;
      setslideAmount(slideAmount);
      setcurrentImage(currentImage - 1);
    }
  }

  function showNext() {
    if (slider.current) {
      slideAmount = slideAmount - slider.current?.clientWidth;
      slider.current.style.transform = `translateX(${slideAmount}px)`;
      setslideAmount(slideAmount);
      setcurrentImage(currentImage + 1);
    }
  }

  const slider = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full h-[400px]" key={Date.now()}>
      {ImageCount == 1 ? null : (
        <PageIndicator
          pagesCount={ImageCount}
          currentPage={currentImage}
          className="left-0 mb-4"
        />
      )}
      <div
        className={"relative flex w-full h-[400px] overflow-hidden bg-black"}
      >
        {currentImage != 0 ? (
          <div
            className="absolute flex bg-white/60 left-0 items-center h-full w-12 z-[1] opacity-0 hover:opacity-100"
            onClick={showPrev}
          >
            <BsChevronCompactLeft className=" text-3xl" />
          </div>
        ) : null}

        <div className={"bg-black w-[100%] h-full flex "} ref={slider}>
          {images.map((imageCode) => {
            return (
              <img
                src={getNftProfileImage(imageCode)}
                className="w-full h-full p-2"
              />
            );
          })}
        </div>
        {currentImage == ImageCount - 1 ? null : (
          <div
            className="absolute bg-white/80 right-0 flex items-center   h-full z-[1] w-12 opacity-0 hover:opacity-100"
            onClick={showNext}
          >
            <BsChevronCompactRight className="text-3xl " />
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
